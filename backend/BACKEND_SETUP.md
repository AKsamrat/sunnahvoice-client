# SunnahVoice API

Laravel 12 REST API for the SunnahVoice React application.

## Local setup

1. Start Apache and MySQL in XAMPP.
2. Create a MySQL database named `sunnahvoice`.
3. Review the `DB_*` values in `.env`.
4. Run:

```powershell
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

The API base URL is `http://127.0.0.1:8000/api/v1`.

The development seeder creates `admin@sunnahvoice.test` with password
`ChangeMe123!`. Change it immediately, or set `ADMIN_EMAIL` and
`ADMIN_PASSWORD` in `.env` before seeding.

## Main endpoints

- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`
- `GET /media?type=image|video|audio`
- `GET /media/{slug}`, `POST /media/{slug}/download`
- `GET /categories`
- `GET /posts`, `GET /posts/{slug}`
- `POST /contact`
- `/admin/*` routes require a Sanctum bearer token belonging to an admin

For protected requests, send `Authorization: Bearer YOUR_TOKEN`.

Media uploads use `multipart/form-data`. Uploaded files are stored on the
`public` disk and become web-accessible after `php artisan storage:link`.

## Quality checks

```powershell
vendor\bin\pint
php artisan test
```
