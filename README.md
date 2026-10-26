## Authentication and Roles (Laravel Sanctum)

Protected endpoints need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/login` | Public | Login and get a token |
| POST | `/api/logout` | Authenticated | Revoke the current token |
| GET | `/api/me` | Authenticated | Current user info |
| GET | `/api/students` | Admin, User | List students |
| GET | `/api/students/{id}` | Admin, User | Get one student |
| POST | `/api/students` | Admin only | Create a student |
| PUT | `/api/students/{id}` | Admin only | Update a student |
| DELETE | `/api/students/{id}` | Admin only | Delete a student |

## Test Accounts (after `php artisan db:seed`)
| Role | Email | Password |
|------|-------|----------|
| Administrator | admin@example.com | password123 |
| Regular User | user@example.com | password123 |

## Response Codes
- 401: invalid credentials, missing token, or revoked token
- 403: authenticated but not allowed (regular user on admin-only endpoint)
- 422: validation error