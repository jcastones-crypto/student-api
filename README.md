# Student Records RESTful API

A RESTful API built with **Laravel** for managing student records. Tested using **Postman**. This project has no front-end interface.

## Features
- Retrieve all students and a single student by ID
- Create a new student using a JSON request
- Update an existing student using PUT
- Delete a student
- Input validation with proper error responses (422 and 404)

## Tech Stack
- Laravel
- MySQL
- Postman (API testing)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/{id}` | Get one student by ID |
| POST | `/api/students` | Create a new student |
| PUT | `/api/students/{id}` | Update a student |
| DELETE | `/api/students/{id}` | Delete a student |

## Student Fields

| Field | Type | Rules |
|-------|------|-------|
| student_number | string | required, unique |
| first_name | string | required, max 100 |
| last_name | string | required, max 100 |
| email | string | required, valid email, unique |
| course | string | required, max 100 |
| year_level | integer | required, between 1 and 6 |

## Sample Request (POST /api/students)

```json
{
  "student_number": "2024-0001",
  "first_name": "Juan",
  "last_name": "Dela Cruz",
  "email": "juan@example.com",
  "course": "BSIT",
  "year_level": 3
}
```

## Sample Success Response (201)

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 1,
    "student_number": "2024-0078",
    "first_name": "Jiane",
    "last_name": "Castones",
    "email": "jcastones@ssct.edu.ph",
    "course": "BSICT",
    "year_level": 3
  }
}
```

## Sample Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "student_number": ["The student number field is required."],
    "email": ["The email field must be a valid email address."]
  }
}
```

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/jcastones-crypto/student-api.git
   cd student-api
   ```
2. Install dependencies
   ```bash
   composer install
   ```
3. Copy the environment file and generate the app key
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Create a MySQL database named `student_api` and update `.env`
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=student_api
   DB_USERNAME=root
   DB_PASSWORD=
   ```
5. Run the migrations
   ```bash
   php artisan migrate
   ```
6. Start the server
   ```bash
   php artisan serve
   ```
7. The API is now available at `http://127.0.0.1:8000/api/students`

## Testing
Use Postman and set the header `Accept: application/json` on every request.

## Author
Jiane Castones