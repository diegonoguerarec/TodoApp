# TodoApp
A full stack Todo application built with NodeJs, Express, PostgreSQL, React and Docker.

Features authentication with JWT and user-specific task managment.

This project was built as a personal learning exercise to explore full-stack web development and modern development workflows. Through building it, I gained practical experience with NodeJs, Express, React, JWT Authentication, Prisma ORM, API REST Design and Docker. I also learned how to structure full-stack applications and environmental variables management.

## Preview
![Task dashboards](/img/image-3.png)
![Register form](/img/image-1.png)
![Login form](/img/image.png)


## Features
- User registration and login
- JWT authentication
- Protected API routes
- User-specific todos
- Dockerized full-stack setup
- Single-command startup with Docker Compose

## Tech stack
### Frontend
- React
- Vite

### Backend
- NodeJs
- Express
- Prisma

### Database
- PostgreSQL

### Devops
- Docker and Docker Compose

## Running the project
### Prerequisites
- Docker
- Docker Compose

Important: Fill the three .env files located in the main, backend and frontend folder, and make sure port numbers match with backend and frontend .env.

### Start the app
```
    docker compose up --build
```

Frontend: http://localhost:5173

Backend: http://localhost:3000