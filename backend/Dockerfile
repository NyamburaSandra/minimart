### file: backend/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY . /app
ENV PYTHONPATH=/app

# Default command for running Gunicorn
CMD ["gunicorn", "marketinghack.marketinghack.wsgi:application", "--bind", "0.0.0.0:8000"]
