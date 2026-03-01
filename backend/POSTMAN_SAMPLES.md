# NeuroFleetX Auth API - Sample Postman JSON Bodies

## Register (ADMIN)
```json
{
  "fullName": "Admin User",
  "email": "admin@neurofleetx.com",
  "password": "Admin@123",
  "role": "ADMIN",
  "gender": "Male",
  "registrationNumber": "ADM-REG-001"
}
```

## Register (FLEET_MANAGER)
```json
{
  "fullName": "Fleet Manager User",
  "email": "manager@neurofleetx.com",
  "password": "Manager@123",
  "role": "FLEET_MANAGER",
  "gender": "Female",
  "companyName": "NeuroFleet Logistics"
}
```

## Register (DRIVER)
```json
{
  "fullName": "Driver User",
  "email": "driver@neurofleetx.com",
  "password": "Driver@123",
  "role": "DRIVER",
  "gender": "Male",
  "licenseNumber": "DL-99887766"
}
```

## Register (CUSTOMER)
```json
{
  "fullName": "Customer User",
  "email": "customer@neurofleetx.com",
  "password": "Customer@123",
  "role": "CUSTOMER",
  "gender": "Other",
  "phoneNumber": "+91-9999999999",
  "city": "Bengaluru"
}
```

## Login
```json
{
  "email": "admin@neurofleetx.com",
  "password": "Admin@123",
  "role": "ADMIN"
}
```
