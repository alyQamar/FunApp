# Fun App API

**Fun App** is an Egyptian application that facilitates a simple sign-up process. The app only accepts sign-ups from phones located in Egypt using the LocationIQ API for reverse geocoding.

## Features

- **Sign Up**: Users can sign up by providing their name, email, and location (latitude and longitude). The app only allows sign-ups from within Egypt.
- **Get User**: Retrieve user information by their ID.
- **Swagger UI**: Interactive API documentation for easy testing and exploration.

## Prerequisites

- Docker
- Docker Compose

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/alyQamar/FunApp.git
cd your-repository
```

### 2. Create a `.env` File

Duplicate the `.env.example` file and name it `.env` in the root directory. Update it with your real environment variables.

```bash
cp .env.example .env
```

### 3. Start the Application with Docker Compose

```bash
docker-compose -f docker-compose.example.yml up --build
```

This command will build and start the services defined in `docker-compose.example.yml`, including the API, PostgreSQL database, and PGAdmin.

### 4. Access Swagger UI

Once the application is running, you can access the Swagger UI at [http://localhost:5000/api](http://localhost:5000/api) to interact with the API endpoints.

### 5. Documentation Coverage

To view the documentation coverage, you can run Compodoc:

```bash
npx @compodoc/compodoc -p tsconfig.json -s --port 7824 --watch -d ./documentation
```

This will start a server on [http://localhost:7824](http://localhost:7824) to view the generated documentation.

## API Endpoints

### `GET /users/:userId`

Retrieve a user by their ID.

- **Parameters**: `userId` (integer) - The ID of the user.
- **Responses**:
  - `200 OK`: Successfully retrieved user.
  - `400 Bad Request`: Invalid or expired user token.
  - `404 Not Found`: User not found.

### `POST /users/signup`

Sign up a new user.

- **Body**: `SignUpDto` - The user sign-up details (name, email, latitude, longitude).
- **Responses**:
  - `201 Created`: User successfully created.
  - `400 Bad Request`: Email already exists or sign-up is restricted to Egypt.