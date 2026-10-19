FROM node:22-slim AS frontend
WORKDIR /frontend
COPY erd_frontend/package*.json ./
RUN npm ci
COPY erd_frontend ./
RUN npm run build

FROM python:3.14-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    BUNDLED_CHALLENGES_PATH=/app/bundled_data/challenges.json \
    STREAMLIT_SERVER_HEADLESS=true \
    STREAMLIT_SERVER_ADDRESS=0.0.0.0 \
    STREAMLIT_SERVER_PORT=8501 \
    STREAMLIT_BROWSER_GATHER_USAGE_STATS=false

WORKDIR /app

COPY requirements.txt ./
RUN python -m pip install --no-cache-dir -r requirements.txt \
    && mkdir -p /app/database \
    && chown -R 10001:10001 /app

COPY --chown=10001:10001 app.py ./
COPY --chown=10001:10001 .streamlit/config.toml ./.streamlit/config.toml
COPY --chown=10001:10001 LICENSE ./LICENSE
COPY --chown=10001:10001 src ./src
COPY --from=frontend --chown=10001:10001 /src/erd_assets ./src/erd_assets
COPY --from=frontend --chown=10001:10001 /src/sql_assets ./src/sql_assets
COPY --from=frontend --chown=10001:10001 /src/python_assets ./src/python_assets
COPY --from=frontend --chown=10001:10001 /src/sql_tools_assets/editor.css ./src/sql_tools_assets/editor.css
COPY --from=frontend --chown=10001:10001 /static ./static
COPY --chown=10001:10001 erd_frontend/THIRD_PARTY_LICENSES.txt ./src/erd_assets/THIRD_PARTY_LICENSES.txt
COPY --chown=10001:10001 erd_frontend/SQL_THIRD_PARTY_LICENSES.txt ./src/sql_assets/THIRD_PARTY_LICENSES.txt
COPY --chown=10001:10001 erd_frontend/PYTHON_THIRD_PARTY_LICENSES.txt ./src/python_assets/THIRD_PARTY_LICENSES.txt
COPY --chown=10001:10001 erd_frontend/SQL_TOOLS_THIRD_PARTY_LICENSES.txt ./src/sql_tools_assets/THIRD_PARTY_LICENSES.txt
COPY --chown=10001:10001 data/challenges.json data/validation_report.json ./data/
COPY --chown=10001:10001 data/challenges.json data/validation_report.json ./bundled_data/

USER 10001:10001
EXPOSE 8501

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8501/_stcore/health', timeout=3)" || exit 1

CMD ["streamlit", "run", "app.py"]
