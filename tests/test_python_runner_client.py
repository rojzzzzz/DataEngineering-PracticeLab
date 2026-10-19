from io import BytesIO
from urllib.error import HTTPError

import pytest

from src import python_runner


@pytest.mark.parametrize("body, expected", [
    (b'{"error":"Job not found"}', "Job not found"),
    (b"<html>Unavailable</html>", "HTTP 503"),
    (b"[]", "HTTP 503"),
    (b'{"error":null}', "HTTP 503"),
])
def test_http_failures_produce_readable_errors(monkeypatch, body, expected):
    monkeypatch.setenv("PYTHON_RUNNER_TOKEN", "test-token")
    response = BytesIO(body)

    def fail(*args, **kwargs):
        raise HTTPError("http://localhost/health", 503, "Unavailable", {}, response)

    monkeypatch.setattr(python_runner, "urlopen", fail)
    with pytest.raises(RuntimeError, match=expected):
        python_runner.request("GET", "/health")
    assert response.closed
