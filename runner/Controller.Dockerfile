FROM docker:29.4.3-cli@sha256:51e23845f5caff1e688a2fae003b0c69d635c9200ad544731db1593731df1d3a AS cli
FROM python:3.14.2-slim@sha256:1a3c6dbfd2173971abba880c3cc2ec4643690901f6ad6742d0827bae6cefc925
COPY --from=cli /usr/local/bin/docker /usr/local/bin/docker
WORKDIR /app
COPY runner/controller.py ./runner/controller.py
COPY src/python_models.py ./src/python_models.py
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PYTHON_RUNNER_HOST=0.0.0.0 PYTHON_RUNNER_TOKEN_FILE=/run/secrets/python_runner_token
CMD ["python", "-m", "runner.controller"]
