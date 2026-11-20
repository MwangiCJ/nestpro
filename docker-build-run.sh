#!/usr/bin/env bash
set -euo pipefail

# Build the NestPro Docker image and run it with the container port mapped to host port 2030.
# The env file (.env.docker by default) is required and its values take precedence over
# shell environment variables passed to the container.
#
# Usage:
#   cp .env.docker.example .env.docker   # fill in APP_KEY and database details
#   ./docker-build-run.sh
#
# Optional environment variables:
#   IMAGE_NAME=nestpro:latest                 Docker image tag to build/run
#   CONTAINER_NAME=nestpro-app                Container name
#   HOST_PORT=2030                            Host port mapped to container port 80
#   ENV_FILE=.env.docker                     Env file passed to `docker run --env-file` (required)
#   STORAGE_VOLUME=nestpro-storage            Docker volume for /var/www/html/storage
#   BOOTSTRAP_VOLUME=nestpro-bootstrap-cache  Docker volume for /var/www/html/bootstrap/cache
#
# Runtime app/database values should be set in ENV_FILE (e.g. APP_KEY, APP_URL,
# DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD, RUN_MIGRATIONS).
# If a forwarded shell variable is also defined in ENV_FILE, the ENV_FILE value is used.

IMAGE_NAME="${IMAGE_NAME:-nestpro:latest}"
CONTAINER_NAME="${CONTAINER_NAME:-nestpro-app}"
HOST_PORT="${HOST_PORT:-2030}"
ENV_FILE="${ENV_FILE:-.env.docker}"
STORAGE_VOLUME="${STORAGE_VOLUME:-nestpro-storage}"
BOOTSTRAP_VOLUME="${BOOTSTRAP_VOLUME:-nestpro-bootstrap-cache}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed or not in PATH." >&2
  exit 1
fi

if [ ! -f "${ENV_FILE}" ]; then
  echo "Error: env file not found: ${ENV_FILE}" >&2
  echo "Create it from the example and fill in APP_KEY and database details:" >&2
  echo "  cp .env.docker.example .env.docker" >&2
  exit 1
fi

env_file_has_var() {
  local var="$1"
  grep -qE "^[[:space:]]*(export[[:space:]]+)?${var}=" "$ENV_FILE"
}

echo "==> Using env file: ${ENV_FILE}"
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
  --env-file "${ENV_FILE}"
)

# Forward selected runtime variables from the shell only when they are not defined
# in the env file, so ENV_FILE values always take precedence.
for var in APP_NAME APP_ENV APP_KEY APP_DEBUG APP_URL LOG_CHANNEL LOG_LEVEL \
           DB_CONNECTION DB_HOST DB_PORT DB_DATABASE DB_USERNAME DB_PASSWORD \
           SESSION_DRIVER CACHE_STORE QUEUE_CONNECTION FILESYSTEM_DISK RUN_MIGRATIONS; do
  if [ -n "${!var-}" ]; then
    if env_file_has_var "$var"; then
      echo "    Note: ignoring shell ${var} because ${ENV_FILE} takes precedence"
    else
      RUN_ARGS+=(-e "${var}=${!var}")
    fi
  fi
done

echo "==> Starting container: ${CONTAINER_NAME}"
echo "    Host port: ${HOST_PORT} -> Container port: 80"
docker run "${RUN_ARGS[@]}" "${IMAGE_NAME}"

echo "==> Container started"
docker ps --filter "name=^/${CONTAINER_NAME}$" --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

APP_URL_DISPLAY="${APP_URL:-}"
if [ -z "${APP_URL_DISPLAY}" ]; then
  APP_URL_DISPLAY="$(grep -E '^[[:space:]]*(export[[:space:]]+)?APP_URL=' "${ENV_FILE}" | tail -n1 | sed -E 's/^[[:space:]]*(export[[:space:]]+)?APP_URL=//' | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//' | sed -E "s/^['\"]//; s/['\"]$//" || true)"
fi

echo "==> App should be reachable at: ${APP_URL_DISPLAY:-http://<host>:${HOST_PORT}}"
echo "    Logs: docker logs -f ${CONTAINER_NAME}"
