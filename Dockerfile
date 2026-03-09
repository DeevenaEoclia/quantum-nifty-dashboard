FROM node:18-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

RUN npm run build

FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend
COPY backend/ backend/

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/dist backend/static

# Expose port
EXPOSE 8000

# Run the backend with dynamic port
CMD python -m uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}
