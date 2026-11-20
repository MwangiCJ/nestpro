#!/usr/bin/env bash
set -euo pipefail

# Build the NestPro Docker image and run it with the container port mapped to host port 2030.
#
# Usage:
#   cp .env.docker.example .env.docker   # fill in APP_KEY and database details
#   ENV_FILE=.env.docker ./docker-build-run.sh
#   # or simply: ./docker-build-run.sh
#
# Optional environment variables:
#   IMAGE_NAME=nestpro:latest        Docker image tag to build/run
#   CONTAINER_NAME=nestpro-app       Container name
#   HOST_PORT=2030                   Host port mapped to container port 80
#   ENV_FILE=.env.docker            Env file passed to `docker run --env-file`
#   APP_URL=http://server:2030       Public app URL (forwarded into the container)
#   APP_KEY=base64:...               Laravel app key (recommended for production)
#   DB_CONNECTION/DB_HOST/DB_PORT/DB_DATABASE/DB_USERNAME/DB_PASSWORD  Database details
#   RUN_MIGRATIONS=true|false        Run migrations on container start (default: true)

IMAGE_NAME="${IMAGE_NAME:-nestpro:latest}"
CONTAINER_NAME="${CONTAINER_NAME:-nestpro-app}"
HOST_PORT="${HOST_PORT:-2030}"
ENV_FILE="${ENV_FILE:-}"
STORAGE_VOLUME="${STORAGE_VOLUME:-nestpro-storage}"
BOOTSTRAP_VOLUME="${BOOTSTRAP_VOLUME:-nestpro-bootstrap-cache}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed or not in PATH." >&2
  exit 1
fi

echo "==> Building Docker image: ${IMAGE_NAME}"
docker build -t "${IMAGE_NAME}" .

echo "==> Removing existing container if present: ${CONTAINER_NAME}"
docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true

echo "==> Ensuring persistent volumes exist"
docker volume create "${STORAGE_VOLUME}" >/dev/null
docker volume create "${BOOTSTRAP_VOLUME}" >/dev/null

RUN_ARGS=(
  -d
  --name "${CONTAINER_NAME}"
  --restart unless-stopped
  -p "${HOST_PORT}:80"
  -v "${STORAGE_VOLUME}:/var/www/html/storage"
  -v "${BOOTSTRAP_VOLUME}:/var/www/html/bootstrap/cache"
)

if [ -n "${ENV_FILE}" ]; then
  if [ ! -f "${ENV_FILE}" ]; then
    echo "Error: ENV_FILE not found: ${ENV_FILE}" >&2
    exit 1
  fi
  RUN_ARGS+=(--env-file "${ENV_FILE}")
fi

# Forward selected runtime variables if provided in the current environment
for var in APP_NAME APP_ENV APP_KEY APP_DEBUG APP_URL LOG_CHANNEL LOG_LEVEL \
           DB_CONNECTION DB_HOST DB_PORT DB_DATABASE DB_USERNAME DB_PASSWORD \
           SESSION_DRIVER CACHE_STORE QUEUE_CONNECTION FILESYSTEM_DISK RUN_MIGRATIONS; do
  if [ -n "${!var-}" ]; then
    RUN_ARGS+=(-e "${var}=${!var}")
  fi
done

echo "==> Starting container: ${CONTAINER_NAME}"
echo "    Host port: ${HOST_PORT} -> Container port: 80"
docker run "${RUN_ARGS[@]}" "${IMAGE_NAME}"

echo "==> Container started"
docker ps --filter "name=^/${CONTAINER_NAME}$" --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

echo "==> App should be reachable at: ${APP_URL:-http://<host>:${HOST_PORT}}"
echo "    Logs: docker logs -f ${CONTAINER_NAME}"
