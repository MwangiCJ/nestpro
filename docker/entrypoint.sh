#!/bin/sh
set -e

cd /var/www/html

# Ensure runtime directories exist and are writable (important for mounted volumes)
mkdir -p \
  storage/app/public \
  storage/framework/cache/data \
  storage/framework/sessions \
  storage/framework/testing \
  storage/framework/views \
  storage/logs \
  bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R ug+rwX storage bootstrap/cache 2>/dev/null || true

# Create .env from example if not provided (useful for first boot; prefer env vars in production)
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
fi

# Generate APP_KEY if missing and APP_KEY env var is not supplied
if [ -z "${APP_KEY:-}" ]; then
  current_key=""
  if [ -f .env ]; then
    current_key="$(grep -E '^APP_KEY=' .env | head -n 1 | cut -d '=' -f2- || true)"
  fi
  if [ -z "$current_key" ]; then
    echo "APP_KEY not set; generating a new key..."
    php artisan key:generate --force --ansi || true
  fi
fi

# Wait for database if host is provided (MySQL/PostgreSQL)
if [ -n "${DB_HOST:-}" ] && [ "${DB_CONNECTION:-}" != "sqlite" ]; then
  echo "Waiting for database at ${DB_HOST}:${DB_PORT:-3306}..."
  max_tries="${DB_WAIT_MAX_TRIES:-30}"
  i=0
  until php artisan db:show >/dev/null 2>&1; do
    i=$((i+1))
    if [ "$i" -ge "$max_tries" ]; then
      echo "Database not reachable after ${max_tries} attempts; continuing startup."
      break
    fi
    sleep 2
  done
fi

# Run migrations on boot (disable with RUN_MIGRATIONS=false)
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "Running database migrations..."
  php artisan migrate --force || echo "Migration failed; continuing startup."
fi

# Storage symlink (idempotent)
php artisan storage:link >/dev/null 2>&1 || true

# Optimize for production when not in debug mode
if [ "${APP_ENV:-production}" != "local" ] && [ "${APP_DEBUG:-false}" != "true" ]; then
  echo "Caching configuration, routes, and views..."
  php artisan config:cache || true
  php artisan route:cache || true
  php artisan view:cache || true
fi

exec "$@"
