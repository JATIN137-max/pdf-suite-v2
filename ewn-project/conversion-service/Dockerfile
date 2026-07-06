FROM python:3.11-slim

# LibreOffice is the heavy dependency here (~600MB) - this is why it lives
# in its own service instead of alongside the main Node backend.
RUN apt-get update && apt-get install -y \
    libreoffice \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Render injects $PORT at runtime - shell form (no brackets) so the
# variable actually gets substituted; exec form would pass it literally.
CMD uvicorn app:app --host 0.0.0.0 --port ${PORT:-8001}
