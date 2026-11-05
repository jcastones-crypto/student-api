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

## Vue.js 3 Frontend (Lab Activity 3)

The Vue 3 frontend lives in the **same Laravel project and repository** (`resources/js`) and is built with Vite. It talks to the Laravel RESTful API from Lab Activities 1 and 2.

### Structure
| File | Purpose |
|------|---------|
| `resources/views/app.blade.php` | Blade page that mounts the Vue app |
| `resources/js/app.js` | Creates and mounts the Vue app |
| `resources/js/App.vue` | Main component (login, CRUD logic, feedback messages) |
| `resources/js/components/StudentList.vue` | Student table (`v-for`, `v-if`, props) |
| `resources/js/components/StudentForm.vue` | Add / update form (props, validation errors) |
| `resources/js/components/LoginForm.vue` | Login form |
| `resources/js/components/AlertMessage.vue` | Success / error messages |
| `resources/js/api.js` | Axios setup that sends the Bearer token |

### Features
- Login with the Sanctum token (stored in the browser)
- Retrieve, add, update, and delete students through the Vue interface
- Admin sees the full CRUD buttons; a regular user can only view the list
- Success messages, validation errors (422), and error messages (401, 403, 404)

### Run the project
```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve        # terminal 1
npm run dev              # terminal 2
```
Open http://127.0.0.1:8000
