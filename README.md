<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Docker

This project includes Docker support for building a production-ready image (nginx + PHP-FPM) and running it with MySQL via Docker Compose.

### Quick script (build + run on host port 2030)

A helper script is included to build the image and run the container mapped to host port **2030**:

```bash
chmod +x docker-build-run.sh
./docker-build-run.sh
```

Optional variables: `IMAGE_NAME` (default `nestpro:latest`), `CONTAINER_NAME` (default `nestpro-app`), `HOST_PORT` (default `2030`), `ENV_FILE` (e.g. `.env.docker`), and app/DB vars like `APP_KEY`, `APP_URL`, `DB_*`, `RUN_MIGRATIONS`.

Example with an env file:

```bash
ENV_FILE=.env.docker APP_URL=http://your-server:2030 ./docker-build-run.sh
```

### Build and run with Docker Compose

1. Create an environment file (or export variables in your deployment environment):
   - Copy values from `.env.docker.example` as a starting point.
   - Set a strong `APP_KEY` (generate one with `php artisan key:generate --show` from a PHP/Laravel environment, or let the container generate one on first boot if none is provided).
   - Set secure database passwords and the correct `APP_URL`.

2. Build and start:
   ```bash
   docker compose up -d --build
   ```

3. Open the app at `http://localhost:8080` (or the host/port you configured via `APP_PORT` / `APP_URL`).

On startup the container waits for the database, runs migrations by default (`RUN_MIGRATIONS=true`), creates the storage symlink, and caches config/routes/views for production.

### Build and run the image manually

```bash
docker build -t nestpro:latest .
docker run -d --name nestpro \
  -p 8080:80 \
  -e APP_ENV=production \
  -e APP_DEBUG=false \
  -e APP_KEY=base64:YOUR_KEY_HERE \
  -e APP_URL=http://your-server:8080 \
  -e DB_CONNECTION=mysql \
  -e DB_HOST=your-db-host \
  -e DB_PORT=3306 \
  -e DB_DATABASE=nestpro \
  -e DB_USERNAME=nestpro \
  -e DB_PASSWORD=secret \
  nestpro:latest
```

For SQLite instead of MySQL, set `DB_CONNECTION=sqlite` and mount/provide a persistent SQLite database file (default path is `database/database.sqlite` inside the app). For production on a remote server, prefer MySQL/PostgreSQL and a reverse proxy (TLS termination) in front of the container.

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
