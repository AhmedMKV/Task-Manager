# TaskManager Full Stack

A complete full-stack task management system built with React + Vite (Frontend) and Spring Boot 3 (Backend).

## Project Structure

```
taskManager/
├── Back-end/          # Spring Boot 3 Backend
└── Front-end/         # React + Vite Frontend
```

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (USER, ADMIN)
- Password hashing with BCrypt

### Task Management
- Create, read, update, and delete tasks
- Mark tasks as completed
- Users can only manage their own tasks
- Admins can view all tasks

### Security
- JWT token authentication
- CORS configuration for React frontend
- Global exception handling
- Input validation

## Prerequisites

- **Java 25** (or Java 21+)
- **Maven 3.6+**
- **Node.js 18+** and npm
- **MySQL 8.0+** (or use H2 for development)
- **MySQL Database**: Create a database named `taskdb`

## Backend Setup

### 1. Database Configuration

#### Option A: MySQL (Production)
1. Create MySQL database:
   ```sql
   CREATE DATABASE taskdb;
   ```

2. Update `Back-end/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/taskdb
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

#### Option B: H2 (Development/Testing)
Run with H2 profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=active=h2
```

### 2. Build and Run Backend

```bash
cd Back-end
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Default Users

The application automatically creates these users on startup:
- **Admin**: `admin` / `admin123` (roles: ADMIN, USER)
- **User**: `user` / `user123` (roles: USER)

## Frontend Setup

### 1. Install Dependencies

```bash
cd Front-end
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

## API Endpoints

### Authentication

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "username": "ahmed",
  "password": "12345"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "username": "ahmed",
  "password": "12345"
}

Response:
{
  "token": "JWT_TOKEN_HERE"
}
```

### Tasks (Requires Authentication)

#### Get User Tasks
```
GET /tasks
Authorization: Bearer {token}
```

#### Create Task
```
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Buy milk",
  "description": "From market"
}
```

#### Update Task
```
PUT /tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated",
  "description": "Updated desc",
  "completed": true
}
```

#### Delete Task
```
DELETE /tasks/{id}
Authorization: Bearer {token}
```

### Admin Endpoints (Requires ADMIN Role)

#### Get All Tasks
```
GET /admin/tasks
Authorization: Bearer {token}
```

## Security Configuration

- **Public Endpoints**: `/auth/**`
- **User Endpoints**: `/tasks/**` (requires USER or ADMIN role)
- **Admin Endpoints**: `/admin/**` (requires ADMIN role)
- **JWT Expiration**: 24 hours (86400000 ms)

## Exception Handling

The backend handles:
- **400 Bad Request**: Validation errors
- **401 Unauthorized**: Invalid credentials or missing token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

## Technology Stack

### Backend
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA / Hibernate
- JWT (jjwt 0.12.3)
- MySQL / H2
- BCrypt Password Encoder

### Frontend
- React 18
- Vite 5
- React Router DOM 6
- Axios
- TailwindCSS 3

## Development Notes

1. **CORS**: Configured to allow requests from `http://localhost:5173` and `http://localhost:3000`
2. **JWT Secret**: Change the JWT secret in `application.properties` for production
3. **Database**: JPA auto-generates schema on startup (`spring.jpa.hibernate.ddl-auto=update`)
4. **Logging**: Debug logging enabled for development

## Testing

Use the provided Postman collection (see `postman_collection.json`) to test all endpoints.

## Troubleshooting

### Backend Issues
- **Port 8080 already in use**: Change `server.port` in `application.properties`
- **Database connection error**: Verify MySQL is running and credentials are correct
- **JWT errors**: Check JWT secret configuration

### Frontend Issues
- **CORS errors**: Verify backend CORS configuration
- **API connection errors**: Check backend is running on port 8080
- **Token not persisting**: Check browser localStorage

## License

This project is for educational purposes.

