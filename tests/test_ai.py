import gc
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import threading
import time
import weakref

import pytest

from src.ai import (AIConnection, AIRequest, AIResponse, AISession, ChatCompletionsProvider,
                    AnthropicMessagesProvider, evaluation_revision, parse_evaluation)
from src.prompt_builder import evaluation_prompt, student_prompt
from src.python_models import fingerprint


@pytest.fixture
def server():
    records = []
    reply = {"status": 200, "body": {"model": "fake", "choices": [{"message": {"content": "draft"}, "finish_reason": "stop"}], "usage": {"prompt_tokens": 3}}}
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def do_POST(self):
            records.append({"path": self.path, "headers": dict(self.headers), "body": json.loads(self.rfile.read(int(self.headers["Content-Length"])))})
            if reply.get("delay"):
                time.sleep(reply["delay"])
            body = reply["body"]
            body = body if isinstance(body, bytes) else json.dumps(body).encode()
            self.send_response(reply["status"])
            if not reply.get("omit_length"):
                self.send_header("Content-Length", str(reply.get("length", len(body))))
            if reply["status"] == 302:
                self.send_header("Location", "/stolen-key")
            self.end_headers()
            try:
                self.wfile.write(body)
            except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
                pass
    httpd = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{httpd.server_port}/v1", records, reply
    httpd.shutdown()
    httpd.server_close()
    thread.join()


def request():
    return AIRequest("authoring", "Reviewed prompt\nñ", "doc", "revision")


def wait(session):
    deadline = time.monotonic() + 3
    while session.busy and time.monotonic() < deadline:
        time.sleep(.01)
    assert not session.busy


def test_chat_http_without_key_and_prompt_equivalence(server):
    url, records, _ = server
    connection = AIConnection("Chat Completions", url, "chosen-model", allow_local_http=True)
    req = request()
    result = ChatCompletionsProvider().generate(connection, "", req)
    assert result.applicable and result.text == "draft" and result.model == "fake"
    assert result.usage == {"prompt_tokens": 3}
    assert records[0]["body"]["messages"] == [{"role": "user", "content": req.prompt}]
    assert records[0]["body"]["model"] == "chosen-model"
    assert "Authorization" not in records[0]["headers"]
    assert records[0]["path"] == "/v1/chat/completions"


def test_anthropic_headers_blocks_and_output_parameter(server):
    url, records, reply = server
    reply["body"] = {"model": "reported", "content": [{"type": "text", "text": "one"}, {"type": "thinking", "thinking": "hidden"}, {"type": "text", "text": "two"}], "stop_reason": "end_turn", "usage": {"input_tokens": 5, "output_tokens": 2}}
    result = AnthropicMessagesProvider().generate(AIConnection("Anthropic Messages", url, "manual-model", output_tokens=23, allow_local_http=True), "session-secret", request())
    assert result.applicable and result.text == "one\ntwo"
    record = records[0]
    assert record["path"] == "/v1/messages"
    assert record["headers"]["x-api-key"] == "session-secret"
    assert record["headers"]["anthropic-version"] == "2023-06-01"
    assert "Authorization" not in record["headers"]
    assert record["body"]["max_tokens"] == 23


@pytest.mark.parametrize("url,local", [
    ("http://example.com/v1", True), ("http://127.0.0.1/v1", False),
    ("http://8.8.8.8/v1", True), ("https://key@example.com/v1", False),
    ("https://example.com/v1?key=x", False), ("https://example.com/v1#key", False),
    ("file:///tmp", False), ("http://0.0.0.0/v1", True), ("https://example.com:bad/v1", False),
])
def test_unsafe_urls_rejected(url, local):
    with pytest.raises(ValueError):
        AIConnection("Chat Completions", url, "model", allow_local_http=local)


@pytest.mark.parametrize("url", ["http://localhost:11434/v1", "http://[::1]:11434/v1", "http://192.168.1.20:11434/v1", "http://host.docker.internal:11434/v1", "https://example.com/v1"])
def test_local_and_https_connections(url):
    AIConnection("Chat Completions", url, "free-text", allow_local_http=True)


@pytest.mark.parametrize("status,needle", [(401, "Authentication"), (403, "Access denied"), (404, "Model or endpoint"), (429, "limit"), (400, "parameter"), (500, "rejected"), (302, "Redirect rejected")])
def test_http_errors_no_echo_or_retry(server, status, needle):
    url, records, reply = server
    reply.update(status=status, body=b"session-secret and private student data")
    result = ChatCompletionsProvider().generate(AIConnection("Chat Completions", url, "fake", allow_local_http=True), "session-secret", request())
    assert needle in result.error and "session-secret" not in repr(result)
    assert len(records) == 1


@pytest.mark.parametrize("body", [b"bad-json", b"{", {}, {"choices": []}])
def test_invalid_http_json(server, body):
    url, records, reply = server
    reply["body"] = body
    result = ChatCompletionsProvider().generate(AIConnection("Chat Completions", url, "fake", allow_local_http=True), "", request())
    assert "JSON" in result.error and len(records) == 1


def test_timeout_size_and_truncated_output(server):
    url, records, reply = server
    connection = AIConnection("Chat Completions", url, "fake", timeout=1, allow_local_http=True)
    reply["delay"] = 1.5
    result = ChatCompletionsProvider().generate(connection, "", request())
    assert "timed out" in result.error
    reply["delay"] = 0
    reply["length"] = 8 * 1024 * 1024 + 1
    assert "8 MiB" in ChatCompletionsProvider().generate(connection, "", request()).error
    reply.pop("length")
    reply["body"]["choices"][0]["finish_reason"] = "length"
    result = ChatCompletionsProvider().generate(connection, "", request())
    assert result.text == "draft" and not result.applicable


def test_body_size_limit_without_oversized_content_length(server):
    url, _, reply = server
    reply["body"] = b"x" * (8 * 1024 * 1024 + 1)
    reply["omit_length"] = True
    assert "8 MiB" in ChatCompletionsProvider().generate(AIConnection("Chat Completions", url, "fake", allow_local_http=True), "", request()).error


def test_incomplete_http_body_is_not_a_success(server):
    url, _, reply = server
    reply["length"] = len(json.dumps(reply["body"]).encode()) + 1
    assert "Incomplete" in ChatCompletionsProvider().generate(AIConnection("Chat Completions", url, "fake", allow_local_http=True), "", request()).error


def test_bounded_dns_and_local_resolution(monkeypatch):
    from src import ai
    monkeypatch.setattr(ai.socket, "getaddrinfo", lambda *a, **k: [(ai.socket.AF_INET, ai.socket.SOCK_STREAM, 0, "", ("8.8.8.8", 80))])
    with pytest.raises(ai.TransportError, match="outside the local network"):
        ai.deadline_socket(("host.docker.internal", 80), time.monotonic() + 1, local_only=True)
    def slow(*args, **kwargs):
        time.sleep(.1)
        return []
    monkeypatch.setattr(ai.socket, "getaddrinfo", slow)
    with pytest.raises(TimeoutError):
        ai.deadline_socket(("example.com", 443), time.monotonic() + .02)


def test_secret_echo_is_redacted(server):
    url, _, reply = server
    reply["body"]["model"] = "session-secret"
    reply["body"]["choices"][0]["message"]["content"] = "echo session-secret"
    result = ChatCompletionsProvider().generate(AIConnection("Chat Completions", url, "fake", allow_local_http=True), "session-secret", request())
    assert result.text == "echo [REDACTED]" and result.model == "[REDACTED]"


def test_output_parameter_and_context_limit_no_send(server):
    url, records, _ = server
    connection = AIConnection("Chat Completions", url, "fake", allow_local_http=True, chat_token_parameter="max_completion_tokens", prompt_limit=1)
    result = ChatCompletionsProvider().generate(connection, "", request())
    assert "nothing was sent" in result.error and not records
    assert "max_completion_tokens" in ChatCompletionsProvider().payload(connection, request())


@pytest.mark.parametrize("action", ["cancel", "edit", "navigate", "disconnect", "replace_connection"])
def test_session_single_request_and_late_result_discard(action):
    entered, release = threading.Event(), threading.Event()
    class Provider:
        def generate(self, connection, key, req):
            entered.set()
            assert release.wait(2)
            return AIResponse("late", finish_reason="stop")
    first, other = AISession(), AISession()
    connection = AIConnection("Chat Completions", "https://example.com/v1", "fake")
    first.configure(connection, "secret")
    first.start(request(), Provider())
    assert entered.wait(1)
    with pytest.raises(ValueError, match="still active"):
        first.start(request(), Provider())
    if action == "cancel": first.invalidate("cancelled")
    elif action == "edit": first.reconcile("doc", "new-revision")
    elif action == "navigate": first.reconcile("other-doc", "revision")
    elif action == "disconnect": first.close()
    else: first.configure(connection, "new-secret")
    assert other.request is None and other.connection is None
    release.set()
    wait(first)
    assert first.response is None and first.state in ("cancelled", "outdated")
    first.close()
    assert first._credential == "" and first.connection is None
    assert "secret" not in repr(first)


def test_session_gc_does_not_leave_credential_owner_alive():
    session = AISession()
    session.configure(AIConnection("Chat Completions", "https://example.com/v1", "fake"), "secret")
    owner = weakref.ref(session)
    del session
    gc.collect()
    assert owner() is None


def test_context_excludes_private_checks_and_internal_by_default():
    exercise = {"version": 2, "function": "solve", "starter_code": "", "contract": "public-contract", "examples": [], "cases": [{"expected": "PRIVATE-EXPECTED"}], "reference_solution": "PRIVATE-SOLUTION", "explanation": "PRIVATE-EXPLANATION"}
    challenge = {"id": "PY-1", "student": {"scenario": "public"}, "internal": {"topics": ["OPT-IN-TOPIC"], "assessment_focus": "OPT-IN-FOCUS", "solution": "PRIVATE-INTERNAL"}, "review_exercise": "PRIVATE-REVIEW", "python_playground": exercise}
    assessment = {"source_hash": fingerprint("student-source"), "exercise_hash": fingerprint(exercise), "result": {"ok": True, "cases_passed": 1, "failure_input": "PRIVATE-INPUT", "failure_expected": "PRIVATE-EXPECTED", "failure_actual": "PRIVATE-ACTUAL", "error": "PRIVATE-ERROR"}}
    workspace = {"source": "student-source", "assessment": assessment}
    default = evaluation_prompt(challenge, "student-answer", {"correctness": 100}, "Evaluate", python_workspace=workspace)
    explicit = evaluation_prompt(challenge, "student-answer", {"correctness": 100}, "Evaluate", python_workspace=workspace, include_internal=True)
    assert "OPT-IN" not in default
    assert "OPT-IN-TOPIC" in explicit and "OPT-IN-FOCUS" in explicit
    for prompt in (default, explicit, student_prompt(challenge, "Practice")):
        assert "PRIVATE-" not in prompt
    assert "student-source" in default and '"cases_passed": 1' in default


def test_unrecognized_nested_fields_never_enter_context():
    exercise = {"version": 1, "dialect": "duckdb", "tables": [{"name": "t", "description": "public", "solution": "PRIVATE-TABLE", "columns": [{"name": "n", "type": "INTEGER", "nullable": False, "private": "PRIVATE-COLUMN"}]}], "visible_fixture": {"t": [[1]]}, "tasks": [{"id": "task", "title": "public", "description": "public", "ordered": False, "reference_query": "PRIVATE-QUERY", "columns": [{"name": "n", "type": "integer", "private": "PRIVATE-OUTPUT"}]}], "assessment": {"fixtures": ["PRIVATE-FIXTURE"]}}
    challenge = {"student": {"scenario": "public", "solution": "PRIVATE-STUDENT"}, "sql_playground": exercise}
    assert "PRIVATE-" not in evaluation_prompt(challenge, "answer", {}, "Evaluate")
    assert "PRIVATE-" not in student_prompt(challenge, "Practice")


def test_evaluation_validation_and_document_revision():
    rubric = {"correctness": 60, "reasoning": 40}
    valid = {"rubric_scores": {"correctness": 55, "reasoning": 35}, "total_score": 90, "weak_topics": ["joins"], "mistake_categories": [], "feedback": "A suggestion"}
    assert parse_evaluation(json.dumps(valid), rubric, ["joins"], []) == valid
    for patch in ({"total_score": True}, {"total_score": float("nan")}, {"total_score": 1}, {"rubric_scores": {"correctness": 61, "reasoning": 29}}, {"weak_topics": ["unknown"]}, {"feedback": []}):
        with pytest.raises(ValueError):
            parse_evaluation(json.dumps({**valid, **patch}), rubric, ["joins"], [])
    attempt = {"attempt_id": 1, "answer": "saved", "personal_notes": "do not export"}
    current = evaluation_revision({}, attempt, rubric)
    assert current != evaluation_revision({}, {**attempt, "answer": "edited"}, rubric)
    assert current != evaluation_revision({"changed": True}, attempt, rubric)
    assert current == evaluation_revision({}, {**attempt, "personal_notes": "other"}, rubric)
