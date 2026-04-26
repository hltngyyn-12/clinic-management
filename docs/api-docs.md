# Clinic Management System - API Documentation

---

## 1. Base URL

```
http://localhost:8080
```

---

## 2. Authentication

All business APIs require JWT Bearer Token, except:

* POST /api/auth/register
* POST /api/auth/login
* POST /api/auth/refresh
* GET /
* GET /api/test

Request header format:

```
Authorization: Bearer <access_token>
```

---

## 3. Standard Response Format

Most APIs return a unified response structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## 4. HTTP Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 500  | Internal Server Error |

---

## 5. Authentication APIs

### POST /api/auth/register

Register a new user.

Request:

```json
{
  "username": "patient01",
  "email": "patient01@clinic.local",
  "password": "123456",
  "fullName": "Nguyen Van A",
  "role": "PATIENT"
}
```

---

### POST /api/auth/login

Authenticate user credentials.

Request:

```json
{
  "usernameOrEmail": "doctor1",
  "password": "123456"
}
```

Response:

```json
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "role": "DOCTOR"
}
```

---

### POST /api/auth/refresh

Request:

```json
{
  "refreshToken": "your_refresh_token"
}
```

---

### GET /api/auth/me

Headers:

```
Authorization: Bearer <token>
```

Response:

```json
{
  "userId": 1,
  "username": "doctor1",
  "email": "doctor@gmail.com",
  "role": "DOCTOR"
}
```

---

## 6. Common APIs

### GET /

Health check endpoint.

### GET /api/test

Simple test endpoint.

---

### GET /api/doctors

Retrieve list of doctors.

Response:

```json
{
  "success": true,
  "message": "Lấy danh sách bác sĩ thành công",
  "data": []
}
```

---

### GET /api/doctors/{id}/slots?date=yyyy-MM-dd

Retrieve available slots for a doctor.

---

### GET /api/doctors/{id}/reviews

Retrieve doctor reviews.

---

## 7. Patient APIs

Base path: `/api/patient`

---

### GET /api/patient/doctors

Headers:

```
Authorization: Bearer <token>
```

---

### POST /api/patient/appointments

Headers:

```
Authorization: Bearer <token>
```

Request:

```json
{
  "doctorId": 1,
  "date": "2026-04-30",
  "slotTime": "09:00",
  "reason": "General checkup"
}
```

Response:

```json
{
  "success": true,
  "message": "Đặt lịch khám thành công",
  "data": {
    "appointmentId": 1
  }
}
```

---

### PUT /api/patient/appointments/{appointmentId}/deposit

Headers:

```
Authorization: Bearer <token>
```

Request:

```json
{
  "amount": 100
}
```

---

### GET /api/patient/appointments

### GET /api/patient/medical-history

### GET /api/patient/prescriptions

### GET /api/patient/test-results

---

### POST /api/patient/reviews

Headers:

```
Authorization: Bearer <token>
```

Request:

```json
{
  "appointmentId": 1,
  "rating": 5,
  "comment": "Doctor explained clearly."
}
```

---

### GET /api/patient/reviews

---

## 8. Doctor APIs

Base path: `/api/doctor`

---

### GET /api/doctor/appointments/today

Headers:

```
Authorization: Bearer <token>
```

---

### POST /api/doctor/medical-records

Headers:

```
Authorization: Bearer <token>
```

Request:

```json
{
  "appointmentId": 1,
  "diagnosis": "Common cold",
  "notes": "Patient should rest"
}
```

---

### POST /api/doctor/prescriptions

Headers:

```
Authorization: Bearer <token>
```

Request:

```json
{
  "medicalRecordId": 1,
  "medicineId": 1,
  "dosage": "2 times/day",
  "duration": "5 days"
}
```

---

### POST /api/doctor/test-requests

Headers:

```
Authorization: Bearer <token>
```

Request:

```json
{
  "medicalRecordId": 1,
  "testName": "Blood test"
}
```

---

### GET /api/doctor/patients/{patientId}/history

### GET /api/doctor/profile

### PUT /api/doctor/profile

### GET /api/doctor/medicines

---

## 9. Admin APIs

Base path: `/api/admin`

---

### Doctor Management

* GET /api/admin/doctors
* GET /api/admin/doctors/{doctorId}
* POST /api/admin/doctors
* PUT /api/admin/doctors/{doctorId}
* DELETE /api/admin/doctors/{doctorId}

---

### Specialty Management

* GET /api/admin/specialties
* POST /api/admin/specialties
* PUT /api/admin/specialties/{specialtyId}
* DELETE /api/admin/specialties/{specialtyId}

---

### Medicine Management

* GET /api/admin/medicines
* POST /api/admin/medicines
* PUT /api/admin/medicines/{medicineId}
* DELETE /api/admin/medicines/{medicineId}

---

### Slot Configuration

* GET /api/admin/slot-configs
* POST /api/admin/slot-configs
* PUT /api/admin/slot-configs/{slotConfigId}
* DELETE /api/admin/slot-configs/{slotConfigId}

---

### Revenue Report

GET /api/admin/reports/revenue?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd

---

### Notification Management

* GET /api/admin/notifications
* POST /api/admin/notifications
* PUT /api/admin/notifications/{notificationId}
* DELETE /api/admin/notifications/{notificationId}

---

## 10. Legacy Endpoints

The following endpoints are still available but are no longer used by the main application:

* /api/appointments/me
* /api/medical-records
* /api/prescriptions
* /api/tests

These endpoints are maintained for backward compatibility and may be removed in future versions.

---

## 11. Demo Flow

### Patient

1. Login
2. Retrieve doctors
3. Book appointment
4. Make deposit

### Doctor

1. Login
2. View appointments
3. Create medical record
4. Create prescription

### Admin

1. Login
2. Manage doctors
3. View revenue report

---

## 12. Notes

* All APIs return JSON format
* Ensure correct role is used for each endpoint
* Use Postman or frontend client for testing
