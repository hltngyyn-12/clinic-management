# Clinic Management System - Testing Guide

---

## 1. Purpose

This document describes the testing process for the Clinic Management System, including authentication, role-based flows, and expected behaviors of all main APIs.

---

## 2. Testing Environment

* Backend: Spring Boot (localhost:8080)
* Database: MySQL
* Tool: Postman
* Authentication: JWT Bearer Token

---

## 3. Test Accounts

| Role    | Username | Password |
| ------- | -------- | -------- |
| Patient | patient1 | 123456   |
| Doctor  | doctor1  | 123456   |
| Admin   | admin1   | 123456   |

---

## 4. Authentication Testing

### 4.1 Register

* Endpoint: POST /api/auth/register
* Expected: User created successfully

---

### 4.2 Login

* Endpoint: POST /api/auth/login
* Expected:

  * Return accessToken and refreshToken
  * Role is correct

---

### 4.3 Get Current User

* Endpoint: GET /api/auth/me
* Headers: Authorization Bearer Token
* Expected:

  * Return correct user info
  * Role matches account

---

### 4.4 Refresh Token

* Endpoint: POST /api/auth/refresh
* Expected:

  * New access token is returned

---

## 5. Patient Flow Testing

### Steps:

1. Login as Patient

2. Get doctor list

   * GET /api/doctors
   * Expected: List of doctors returned

3. Book appointment

   * POST /api/patient/appointments
   * Expected: Appointment created

4. Pay deposit

   * PUT /api/patient/appointments/{id}/deposit
   * Expected: Payment successful

5. View appointments

   * GET /api/patient/appointments

6. View medical history

   * GET /api/patient/medical-history

7. View prescriptions

   * GET /api/patient/prescriptions

8. View test results

   * GET /api/patient/test-results

9. Create review

   * POST /api/patient/reviews
   * Expected: Review saved

---

## 6. Doctor Flow Testing

### Steps:

1. Login as Doctor

2. Get today's appointments

   * GET /api/doctor/appointments/today
   * Expected: List of appointments

3. Create medical record

   * POST /api/doctor/medical-records
   * Expected: Record created

4. Create prescription

   * POST /api/doctor/prescriptions
   * Expected: Prescription created

5. Create test request

   * POST /api/doctor/test-requests
   * Expected: Test request created

6. View patient history

   * GET /api/doctor/patients/{patientId}/history

7. Update profile

   * PUT /api/doctor/profile

---

## 7. Admin Flow Testing

### Steps:

1. Login as Admin

2. Manage doctors

   * GET /api/admin/doctors
   * POST /api/admin/doctors
   * PUT /api/admin/doctors/{id}
   * DELETE /api/admin/doctors/{id}

3. Manage specialties

   * CRUD /api/admin/specialties

4. Manage medicines

   * CRUD /api/admin/medicines

5. Manage slot configs

   * CRUD /api/admin/slot-configs

6. View revenue report

   * GET /api/admin/reports/revenue

7. Manage notifications

   * CRUD /api/admin/notifications

---

## 8. Security Testing

* Access API without token → Expect 401 Unauthorized
* Access API with wrong role → Expect 403 Forbidden
* Expired token → Expect failure

---

## 9. Validation Testing

* Missing required fields → Expect 400 Bad Request
* Invalid data format → Expect validation error
* Incorrect IDs → Expect error response

---

## 10. Expected Results

* All APIs return HTTP 200 for valid requests
* Response format is consistent
* Data is correctly stored and retrieved
* Role-based access control works correctly
* No unexpected server errors

---

## 11. Conclusion

The system is considered stable if all test cases above pass successfully and all major user flows (Patient, Doctor, Admin) operate without errors.
