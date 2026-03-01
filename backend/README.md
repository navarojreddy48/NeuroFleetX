# NeuroFleetX Backend (Spring Boot)

## Tech Stack
- Java 17
- Spring Boot
- Spring Data JPA
- Spring Security + JWT
- MySQL
- Maven
- Lombok

## Run
1. Ensure MySQL is running with username `root` and password `root`.
2. From this folder, run:
   ```bash
   mvn spring-boot:run
   ```

## API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (requires `Authorization: Bearer <JWT>`)

Sample request bodies are available in `POSTMAN_SAMPLES.md`.
