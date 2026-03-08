# API Documentation

## 1. Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

## 2. Patient Profile
- GET /api/patients/profile
- PUT /api/patients/profile

## 3. Specialties
- GET /api/specialties
- GET /api/specialties/{id}
- POST /api/admin/specialties
- PUT /api/admin/specialties/{id}
- DELETE /api/admin/specialties/{id}

## 4. Doctors
- GET /api/doctors
- GET /api/doctors/{id}
- GET /api/doctors/{id}/slots
- POST /api/admin/doctors
- PUT /api/admin/doctors/{id}
- DELETE /api/admin/doctors/{id}

## 5. Appointments
- POST /api/patient/appointments
- GET /api/patient/appointments
- GET /api/patient/appointments/{id}
- PUT /api/patient/appointments/{id}/cancel
- GET /api/doctor/appointments/today
- GET /api/doctor/appointments

## 6. Medical Records
- POST /api/doctor/medical-records
- GET /api/patient/medical-records
- GET /api/patient/medical-records/{id}

## 7. Medicines
- GET /api/medicines
- POST /api/admin/medicines
- PUT /api/admin/medicines/{id}
- DELETE /api/admin/medicines/{id}

## 8. Test Results
- POST /api/doctor/test-results/request
- GET /api/patient/test-results
- GET /api/patient/test-results/{id}

## 9. Reviews
- POST /api/patient/reviews
- GET /api/doctors/{id}/reviews