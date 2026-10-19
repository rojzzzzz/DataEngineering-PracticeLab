FROM python:3.14.2-slim@sha256:1a3c6dbfd2173971abba880c3cc2ec4643690901f6ad6742d0827bae6cefc925
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY runner/python_worker.py /opt/python_worker.py
COPY src/python_models.py /opt/python_models.py
USER 65534:65534
WORKDIR /tmp
ENTRYPOINT ["python", "-I", "-u", "/opt/python_worker.py"]
