# NeuroFleetX Backend Blueprint (Spring Boot + MySQL + JWT)

## 1) Database Schema
- Database: `neurofleet_db`
- SQL schema file: `backend/sql/neurofleet_db_schema.sql`
- Includes modules for:
  - User Management (`users`, `roles`)
  - Fleet Management (`vehicles`, `vehicle_status`, `maintenance_records`)
  - Driver Management (`drivers`, `driver_performance`, `driver_trips`)
  - Trips and Routing (`trips`, `routes`, `trip_status`, `live_tracking`)
  - Traffic Analytics (`traffic_data`, `traffic_zones`, `traffic_heatmap`)
  - Financials (`driver_earnings`, `trip_payments`)
  - AI Configuration (`ai_settings`, `route_optimization_parameters`)

## 2) Key Relationships
- `users.role_id -> roles.id`
- `drivers.user_id -> users.id`
- `trips.driver_id -> drivers.id`
- `trips.vehicle_id -> vehicles.id`
- `routes.trip_id -> trips.id`
- `live_tracking.trip_id -> trips.id`
- `driver_earnings.trip_id -> trips.id`

## 3) Backend Packages
- `controller`
- `service`
- `repository`
- `model`
- `config`
- `security` (security config remains under `config` for current codebase)

## 4) REST APIs
### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users
- `GET /api/users`
- `GET /api/users/{id}`

### Vehicles
- `GET /api/vehicles`
- `POST /api/vehicles`
- `PUT /api/vehicles/{id}`

### Drivers
- `GET /api/drivers`
- `GET /api/drivers/{id}`

### Trips
- `GET /api/trips`
- `POST /api/trips`
- `GET /api/trips/driver/{driverId}`

### Traffic Analytics
- `GET /api/traffic/heatmap`

### AI Settings
- `GET /api/ai/settings`
- `PUT /api/ai/settings`

### Additional Integration APIs
- `GET /api/live-tracking/trip/{tripId}`
- `GET /api/earnings/driver/{driverId}`

## 5) JWT Security
- JWT generation and validation: `config/JwtService.java`
- Request filter: `config/JwtAuthenticationFilter.java`
- Security chain + CORS: `config/SecurityConfig.java`
- Role bootstrap seed: `config/DataInitializer.java`

## 6) MySQL Connection (application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/neurofleet_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## 7) CORS for React (Vite)
- Origin allowed via pattern in security config: `http://localhost:*`
- This covers frontend dev server `http://localhost:5173`

## 8) Example API Responses
### Login Response (`POST /api/auth/login`)
```json
{
  "token": "<jwt-token>",
  "role": "DRIVER",
  "fullName": "Sucharit Saha",
  "email": "sucharit.saha@neurofleetx.com",
  "licenseNumber": "WB-DRV-2020-99871"
}
```

### Vehicles (`GET /api/vehicles`)
```json
[
  {
    "id": 1,
    "vehicleName": "Tata Nexon EV",
    "registrationNumber": "MP04AB1234",
    "vehicleType": "EV",
    "batteryPercentage": 78,
    "batteryHealth": 91,
    "engineTemperature": 62.5,
    "tireWear": 14,
    "city": "Bhopal",
    "status": "ACTIVE"
  }
]
```

### Traffic Heatmap (`GET /api/traffic/heatmap`)
```json
[
  {
    "id": 1,
    "latitude": 23.2599,
    "longitude": 77.4126,
    "congestionLevel": 84,
    "recordedAt": "2026-03-04T10:35:00"
  }
]
```

## 9) Frontend Integration
- Reusable API client added at:
  - `frontend/src/services/apiService.js`
- Available API groups:
  - `authApi`
  - `vehicleApi`
  - `tripApi`
  - `liveTrackingApi`
  - `driverEarningsApi`
  - `trafficApi`
  - `aiSettingsApi`

Example usage:
```js
import { authApi, vehicleApi } from '../services/apiService'

const loginResponse = await authApi.login({
  email: 'user@example.com',
  password: 'password123',
  role: 'DRIVER'
})

localStorage.setItem('authToken', loginResponse.token)

const vehicles = await vehicleApi.getAll()
```
