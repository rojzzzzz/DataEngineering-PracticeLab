"""Optional, session-owned textual AI transport. No database, cache or filesystem IO."""
from __future__ import annotations

from dataclasses import dataclass, field
import hashlib
import http.client
import ipaddress
import json
import math
import queue
import socket
import threading
import time
from typing import Protocol
from urllib.parse import urlsplit
from uuid import uuid4
import weakref

HTTP_LIMIT = 8 * 1024 * 1024
PROMPT_LIMIT = 1024 * 1024
SESSION_IDLE_SECONDS = 1800
PROTOCOLS = ("Chat Completions", "Anthropic Messages")


def revision(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False, allow_nan=False).encode()).hexdigest()


def local_address(host):
    if host in ("localhost", "host.docker.internal"):
        return True
    try:
        address = ipaddress.ip_address(host)
        return (address.is_loopback or address.is_private) and not (address.is_unspecified or address.is_multicast)
    except ValueError:
        return False


@dataclass(frozen=True)
class AIConnection:
    protocol: str
    base_url: str
    model: str
    timeout: int = 120
    output_tokens: int = 4096
    allow_local_http: bool = False
    chat_token_parameter: str = "max_tokens"
    prompt_limit: int = PROMPT_LIMIT

    def __post_init__(self):
        try:
            url = urlsplit(self.base_url)
            port = url.port
        except ValueError:
            raise ValueError("Invalid API base URL.") from None
        if (self.protocol not in PROTOCOLS or not url.hostname or url.username is not None
                or url.password is not None or url.query or url.fragment
                or any(ord(c) <= 32 for c in self.base_url)):
            raise ValueError("Use a base URL without credentials, query parameters or fragments.")
        if url.scheme != "https" and not (url.scheme == "http" and self.allow_local_http and local_address(url.hostname)):
            raise ValueError("Remote APIs require HTTPS. Enable HTTP only for an explicit local address.")
        if not isinstance(self.model, str) or not self.model.strip() or len(self.model) > 200:
            raise ValueError("Enter a model name.")
        if type(self.timeout) is not int or not 1 <= self.timeout <= 300:
            raise ValueError("Timeout must be 1–300 seconds.")
        if type(self.output_tokens) is not int or not 1 <= self.output_tokens <= 65536:
            raise ValueError("Output limit must be 1–65536 tokens.")
        if self.chat_token_parameter not in ("max_tokens", "max_completion_tokens"):
            raise ValueError("Unsupported output-token parameter.")
        if type(self.prompt_limit) is not int or not 1 <= self.prompt_limit <= HTTP_LIMIT:
            raise ValueError("Invalid prompt size limit.")

    @property
    def endpoint(self):
        suffix = "/messages" if self.protocol == "Anthropic Messages" else "/chat/completions"
        return self.base_url.rstrip("/") + suffix


@dataclass(frozen=True)
class AIRequest:
    operation: str
    prompt: str = field(repr=False)
    document_id: str
    document_revision: str
    id: str = field(default_factory=lambda: str(uuid4()))


@dataclass(frozen=True)
class AIResponse:
    text: str = field(default="", repr=False)
    model: str = ""
    usage: dict = field(default_factory=dict)
    finish_reason: str = ""
    error: str | None = None

    @property
    def applicable(self):
        return not self.error and bool(self.text) and self.finish_reason in ("stop", "end_turn", "stop_sequence")


class AIProvider(Protocol):
    def generate(self, connection: AIConnection, credential: str, request: AIRequest) -> AIResponse: ...


class TransportError(Exception):
    pass


def deadline_socket(address, deadline, local_only=False):
    """Bound DNS and all address attempts by the same request deadline."""
    resolved = queue.Queue(maxsize=1)
    def resolve():
        try:
            resolved.put(socket.getaddrinfo(*address, type=socket.SOCK_STREAM))
        except OSError as exc:
            resolved.put(exc)
    threading.Thread(target=resolve, daemon=True).start()
    try:
        addresses = resolved.get(timeout=max(.001, deadline - time.monotonic()))
    except queue.Empty:
        raise TimeoutError from None
    if isinstance(addresses, OSError):
        raise addresses
    for family, kind, protocol, _, sockaddr in addresses:
        if local_only and not local_address(sockaddr[0]):
            raise TransportError("HTTP destination resolved outside the local network. Use HTTPS for remote APIs.")
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            raise TimeoutError
        stream = socket.socket(family, kind, protocol)
        try:
            stream.settimeout(remaining)
            stream.connect(sockaddr)
            stream.settimeout(max(.001, deadline - time.monotonic()))
            return stream
        except OSError:
            stream.close()
    raise OSError("No reachable API address")


def post_json(connection, credential, payload):
    """One POST, no redirects/retries/proxies; bound bytes and total elapsed time."""
    url = urlsplit(connection.endpoint)
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    if credential:
        headers["x-api-key" if connection.protocol == "Anthropic Messages" else "Authorization"] = (
            credential if connection.protocol == "Anthropic Messages" else "Bearer " + credential)
    if connection.protocol == "Anthropic Messages":
        headers["anthropic-version"] = "2023-06-01"
    client_type = http.client.HTTPSConnection if url.scheme == "https" else http.client.HTTPConnection
    client = client_type(url.hostname, url.port, timeout=connection.timeout)
    deadline = time.monotonic() + connection.timeout
    client._create_connection = lambda address, timeout, source_address: deadline_socket(address, deadline, url.scheme == "http")
    expired = threading.Event()
    def expire():
        expired.set()
        if client.sock:
            try:
                client.sock.shutdown(socket.SHUT_RDWR)
            except OSError:
                pass
    timer = threading.Timer(connection.timeout, expire)
    timer.daemon = True
    timer.start()
    try:
        client.request("POST", url.path, json.dumps(payload, ensure_ascii=False, allow_nan=False).encode(), headers)
        if client.sock:
            client.sock.settimeout(max(.001, deadline - time.monotonic()))
        response = client.getresponse()
        errors = {401: "Authentication failed. Check the session key.", 403: "Access denied by the provider.",
                  404: "Model or endpoint not found. Check the base URL and model.",
                  429: "Provider usage or rate limit reached. Retry manually later."}
        if not 200 <= response.status < 300:
            message = errors.get(response.status, "Provider rejected the request. Check the protocol, model and output-token parameter.")
            if 300 <= response.status < 400:
                message = "Redirect rejected. Enter the final API base URL explicitly."
            raise TransportError(f"HTTP {response.status}: {message}")
        length = response.getheader("Content-Length")
        if length and int(length) > HTTP_LIMIT:
            raise TransportError("HTTP response exceeds 8 MiB.")
        chunks, size = [], 0
        while True:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                raise TimeoutError
            # A read1 completes after at most one socket read; a trickling body cannot
            # extend the total deadline by repeatedly resetting a per-read timeout.
            if response.fp and response.fp.raw:
                response.fp.raw._sock.settimeout(remaining)
            chunk = response.read1(min(65536, HTTP_LIMIT + 1 - size))
            if not chunk:
                break
            size += len(chunk)
            if size > HTTP_LIMIT:
                raise TransportError("HTTP response exceeds 8 MiB.")
            chunks.append(chunk)
        if expired.is_set():
            raise TimeoutError
        if length and size != int(length):
            raise TransportError("Incomplete HTTP response. Retry manually.")
        return json.loads(b"".join(chunks))
    except (OSError, http.client.HTTPException):
        if expired.is_set():
            raise TimeoutError from None
        raise
    finally:
        timer.cancel()
        client.close()


class ChatCompletionsProvider:
    def payload(self, connection, request):
        return {"model": connection.model, "messages": [{"role": "user", "content": request.prompt}],
                connection.chat_token_parameter: connection.output_tokens, "stream": False}

    def parse(self, body):
        choice = body["choices"][0]
        content = choice["message"]["content"]
        if not isinstance(content, str):
            raise ValueError
        return AIResponse(content, body.get("model", ""), safe_usage(body.get("usage")), choice.get("finish_reason", ""))

    def generate(self, connection, credential, request):
        return generate(self, connection, credential, request)


class AnthropicMessagesProvider(ChatCompletionsProvider):
    def payload(self, connection, request):
        return {"model": connection.model, "messages": [{"role": "user", "content": request.prompt}],
                "max_tokens": connection.output_tokens, "stream": False}

    def parse(self, body):
        text = "\n".join(block["text"] for block in body["content"] if block.get("type") == "text")
        if not isinstance(text, str):
            raise ValueError
        return AIResponse(text, body.get("model", ""), safe_usage(body.get("usage")), body.get("stop_reason", ""))


def safe_usage(value):
    allowed = {"prompt_tokens", "completion_tokens", "total_tokens", "input_tokens", "output_tokens",
               "cache_creation_input_tokens", "cache_read_input_tokens"}
    return {k: v for k, v in (value if isinstance(value, dict) else {}).items()
            if k in allowed and type(v) is int and v >= 0}


def generate(provider, connection, credential, request):
    if not request.prompt.strip():
        return AIResponse(error="The prompt is empty.")
    if len(request.prompt.encode("utf-8")) > connection.prompt_limit:
        return AIResponse(error=f"Prompt exceeds {connection.prompt_limit} bytes. Reduce it explicitly; nothing was sent.")
    try:
        result = provider.parse(post_json(connection, credential, provider.payload(connection, request)))
        # Never echo credentials returned by a misconfigured endpoint.
        if credential:
            result = AIResponse(result.text.replace(credential, "[REDACTED]"), result.model.replace(credential, "[REDACTED]"), result.usage, result.finish_reason.replace(credential, "[REDACTED]"))
        return result
    except (TimeoutError, socket.timeout):
        return AIResponse(error="Request timed out. Your prompt is preserved; retry manually.")
    except TransportError as exc:
        return AIResponse(error=str(exc))
    except (ValueError, KeyError, IndexError, TypeError, AttributeError, RecursionError):
        return AIResponse(error="Invalid or incomplete provider JSON response. Check protocol compatibility.")
    except (OSError, http.client.HTTPException):
        return AIResponse(error="Could not reach the API. Check the URL, TLS and local network.")


def provider_for(connection):
    return AnthropicMessagesProvider() if connection.protocol == "Anthropic Messages" else ChatCompletionsProvider()


class AISession:
    """Owned only by one st.session_state; workers keep no session alive."""
    def __init__(self):
        self.connection = None
        self._credential = ""
        self.request = None
        self.response = None
        self.state = "preparing"
        self._worker_active = False
        self._lock = threading.RLock()
        self._heartbeat = time.monotonic()
        self._watched = False

    def touch(self):
        with self._lock:
            self._heartbeat = time.monotonic()

    def configure(self, connection, credential=""):
        if any(ord(c) < 32 or ord(c) == 127 for c in credential):
            raise ValueError("The API key contains invalid characters.")
        with self._lock:
            self.invalidate("cancelled")
            self.connection, self._credential = connection, credential
            self.touch()
            if not self._watched:
                self._watched = True
                threading.Thread(target=_expire_session, args=(weakref.ref(self),), daemon=True).start()

    @property
    def busy(self):
        return self._worker_active

    def start(self, request, provider=None):
        with self._lock:
            if self.busy:
                raise ValueError("A request is still active in this session. Wait for it to finish.")
            if self.connection is None:
                raise ValueError("Configure an optional connection first.")
            if not request.prompt.strip() or len(request.prompt.encode()) > self.connection.prompt_limit:
                raise ValueError(f"Prompt must be nonempty and fit in {self.connection.prompt_limit} bytes. Reduce it explicitly.")
            self.request, self.response, self.state = request, None, "sending"
            self.touch()  # Starting a request is explicit human activity, unlike polling.
            self._worker_active = True
            connection, credential = self.connection, self._credential
            threading.Thread(target=_run_request, args=(weakref.ref(self), provider or provider_for(connection), connection, credential, request), daemon=True).start()

    def invalidate(self, state="outdated"):
        with self._lock:
            if self.request is not None:
                self.state = state

    def reconcile(self, document_id, document_revision):
        with self._lock:
            if self.request and (self.request.document_id != document_id or self.request.document_revision != document_revision):
                self.invalidate()

    def snapshot(self):
        with self._lock:
            return self.request, self.response, self.state

    def close(self):
        with self._lock:
            self.invalidate("cancelled")
            self.connection, self._credential = None, ""
            self.response = None

    def __del__(self):
        self.close()


def _run_request(owner, provider, connection, credential, request):
    try:
        response = provider.generate(connection, credential, request)
    except Exception:
        response = AIResponse(error="The provider request failed. Retry manually.")
    finally:
        credential = ""
    session = owner()
    if session is not None:
        with session._lock:
            session._worker_active = False
            if session.request and session.request.id == request.id and session.state == "sending":
                session.response = response
                session.state = "error" if response.error else "completed"


def _expire_session(owner):
    while True:
        time.sleep(5)
        session = owner()
        if session is None:
            return
        with session._lock:
            if time.monotonic() - session._heartbeat > SESSION_IDLE_SECONDS:
                session.close()
        del session


def evaluation_revision(challenge, attempt, rubric):
    from src.submission import submission_content
    context = {**submission_content(attempt), **{k: attempt.get(k) for k in ("attempt_id", "challenge_id", "status")}}
    return revision({"challenge": challenge, "rubric": rubric, "attempt": context})


def parse_evaluation(text, rubric, topics, mistakes):
    if len(text.encode()) > HTTP_LIMIT:
        raise ValueError("Evaluation exceeds 8 MiB.")
    text = text.strip()
    if text.startswith("```json\n") and text.endswith("```"):
        text = text[8:-3]
    try:
        result = json.loads(text)
    except (ValueError, RecursionError):
        raise ValueError("Paste a JSON evaluation matching the prompt's format.") from None
    required = {"rubric_scores", "total_score", "weak_topics", "mistake_categories", "feedback"}
    if not isinstance(result, dict) or set(result) != required:
        raise ValueError("Evaluation needs exactly rubric_scores, total_score, weak_topics, mistake_categories and feedback.")
    scores = result["rubric_scores"]
    if not isinstance(scores, dict) or set(scores) != set(rubric):
        raise ValueError("Scores must cover every rubric category exactly once.")
    for category, value in scores.items():
        if type(value) not in (int, float) or not math.isfinite(value) or not 0 <= value <= rubric[category]:
            raise ValueError(f"Invalid score for {category}.")
    total = result["total_score"]
    if type(total) not in (int, float) or not math.isfinite(total) or not 0 <= total <= 100 or not math.isclose(total, sum(scores.values()), abs_tol=.001):
        raise ValueError("Total must equal the rubric sum and be within 0–100.")
    for key, allowed in (("weak_topics", topics), ("mistake_categories", mistakes)):
        values = result[key]
        if not isinstance(values, list) or len(values) > 100 or any(not isinstance(v, str) or v not in allowed for v in values) or len(values) != len(set(values)):
            raise ValueError(f"Use only the listed {key}, without duplicates.")
    if not isinstance(result["feedback"], str) or len(result["feedback"]) > 40000:
        raise ValueError("Feedback must be text of at most 40000 characters.")
    return result
