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
The seeder creates two demo accounts. Their **passwords are NOT stored in this repository**.
Set them in your local `.env` file (which is git-ignored) before seeding:

```env
SEED_ADMIN_PASSWORD=your-own-admin-password
SEED_USER_PASSWORD=your-own-user-password
```

| Role | Email |
|------|-------|
| Administrator | admin@example.com |
| Regular User | user@example.com |

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
# set SEED_ADMIN_PASSWORD and SEED_USER_PASSWORD in .env first
php artisan migrate --seed
php artisan serve        # terminal 1
npm run dev              # terminal 2
```
Open http://127.0.0.1:8000


## State and Authentication with Vue's Composition API (Lab Activity 4)

State is managed with `ref()`, `reactive()`, and `computed()` inside reusable **composables**
(`resources/js/composables`). Every component that calls a composable shares the same state.

| File | State it manages |
|------|------------------|
| `composables/useAuth.js` | token, user, role (`isAdmin`), login, logout, session restore |
| `composables/useStudents.js` | students, search filter, loading/saving/deleting flags, validation errors |
| `composables/useAlert.js` | success and error messages |
| `components/StudentForm.vue` | `reactive()` form object, controlled inputs, client-side validation |

### How authentication works
1. The login form calls `POST /api/login`.
2. Laravel returns a Sanctum token; Vue stores it and sends it as `Authorization: Bearer <token>` on every request (`api.js`).
3. On page load, Vue calls `GET /api/me` so the role comes from the server.
4. Logout calls `POST /api/logout`, which revokes the token in Laravel.

### Roles
| Action | Administrator | Regular User |
|--------|:-------------:|:------------:|
| View / search students | Yes | Yes |
| Add, update, delete | Yes | No (buttons hidden **and** Laravel returns 403) |

Hiding buttons in Vue is only for convenience. **Laravel enforces authentication and permissions**
with the `auth:sanctum` and `role:admin` middleware, so a regular user cannot change data even by
calling the API directly.

### Feedback shown to the user
Loading text, success messages, field-level validation errors (client and Laravel 422),
and error messages for 401, 403, 404, and server connection problems.
