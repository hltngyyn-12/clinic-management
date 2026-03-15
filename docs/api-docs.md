# API Documentation

## Base URL

/api

---

# 1. Authentication

## Register

POST /api/auth/register

Description:
Create a new user account.

Request Body

{
  "username": "user1",
  "email": "user@email.com",
  "password": "123456",
  "full_name": "Nguyen Van A"
}

Database tables:
users

---

## Login

POST /api/auth/login

Description:
Authenticate user and return JWT token.

Request Body

{
  "username": "user1",
  "password": "123456"
}

Response

{
  "token": "jwt-token"
}

Database tables:
users

---

## Get current user

GET /api/auth/me

Description:
Return information about the authenticated user.

Database tables:
users

---

# 2. Patient Profile

## Get patient profile

GET /api/patients/profile

Description:
Get the current patient profile.

Database tables:
patients
users

---

## Update patient profile

PUT /api/patients/profile

Description:
Update patient information.

Database tables:
patients

---

# 3. Specialties

## Get all specialties

GET /api/specialties

Database tables:
specialties

---

## Get specialty by id

GET /api/specialties/{id}

Database tables:
specialties

---

## Create specialty

POST /api/admin/specialties

Database tables:
specialties

---

## Update specialty

PUT /api/admin/specialties/{id}

Database tables:
specialties

---

## Delete specialty

DELETE /api/admin/specialties/{id}

Database tables:
specialties

---

# 4. Doctors

## Get all doctors

GET /api/doctors

Database tables:
doctors
users
specialties

---

## Get doctor by id

GET /api/doctors/{id}

Database tables:
doctors
users

---

## Get doctor slots

GET /api/doctors/{id}/slots

Description:
Return available appointment slots for a doctor.

Database tables:
appointments

---

## Create doctor

POST /api/admin/doctors

Database tables:
doctors
users
specialties

---

## Update doctor

PUT /api/admin/doctors/{id}

Database tables:
doctors

---

## Delete doctor

DELETE /api/admin/doctors/{id}

Database tables:
doctors

---

# 5. Appointments

## Create appointment

POST /api/patient/appointments

Description:
Patient creates a new appointment with a doctor.

Database tables:
appointments
patients
doctors

---

## Get patient appointments

GET /api/patient/appointments

Database tables:
appointments

---

## Get appointment by id

GET /api/patient/appointments/{id}

Database tables:
appointments

---

## Cancel appointment

PUT /api/patient/appointments/{id}/cancel

Database tables:
appointments

---

## Doctor today's appointments

GET /api/doctor/appointments/today

Database tables:
appointments

---

## Doctor appointments

GET /api/doctor/appointments

Database tables:
appointments

---

# 6. Medical Records

## Create medical record

POST /api/doctor/medical-records

Description:
Doctor creates a medical record after consultation.

Database tables:
medical_records
appointments
patients
doctors

---

## Get patient medical records

GET /api/patient/medical-records

Database tables:
medical_records

---

## Get medical record by id

GET /api/patient/medical-records/{id}

Database tables:
medical_records

---

# 7. Medicines

## Get medicines

GET /api/medicines

Database tables:
medicines

---

## Create medicine

POST /api/admin/medicines

Database tables:
medicines

---

## Update medicine

PUT /api/admin/medicines/{id}

Database tables:
medicines

---

## Delete medicine

DELETE /api/admin/medicines/{id}

Database tables:
medicines

---

# 8. Test Results

## Request test result

POST /api/doctor/test-results/request

Database tables:
test_results
medical_records

---

## Get patient test results

GET /api/patient/test-results

Database tables:
test_results

---

## Get test result by id

GET /api/patient/test-results/{id}

Database tables:
test_results

---

# 9. Reviews

## Create review

POST /api/patient/reviews

Description:
Patient leaves review for doctor.

Database tables:
reviews

---

## Get doctor reviews

GET /api/doctors/{id}/reviews

Database tables:
reviews
doctors