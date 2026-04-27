# Clinic Management System - Demo Guide

---

## 1. Objective

This document describes the demonstration flow of the Clinic Management System.
The demo showcases the main features across three roles: Patient, Doctor, and Admin.

---

## 2. Demo Preparation

### 2.1 Environment

* Backend running at: http://localhost:8080
* Frontend or Postman ready
* Database seeded with sample data

---

### 2.2 Test Accounts

| Role    | Username | Password |
| ------- | -------- | -------- |
| Patient | patient1 | 123456   |
| Doctor  | doctor1  | 123456   |
| Admin   | admin1   | 123456   |

---

### 2.3 Tools

* Postman (recommended) or Frontend UI
* Browser (for quick verification if needed)

---

## 3. Demo Scenario Overview

The demo is divided into three main parts:

1. Patient Flow
2. Doctor Flow
3. Admin Flow

Total demo time should be within 5–7 minutes.

---

## 4. Patient Flow

### Step 1: Login

* Endpoint: POST /api/auth/login
* Login using patient account

Expected result:

* Receive access token
* Authentication successful

---

### Step 2: View Doctors

* Endpoint: GET /api/doctors

Expected result:

* List of doctors displayed

---

### Step 3: Book Appointment

* Endpoint: POST /api/patient/appointments

Expected result:

* Appointment created successfully

---

### Step 4: Pay Deposit

* Endpoint: PUT /api/patient/appointments/{id}/deposit

Expected result:

* Deposit payment completed

---

### Step 5: View Appointments

* Endpoint: GET /api/patient/appointments

Expected result:

* Appointment appears in list

---

## 5. Doctor Flow

### Step 1: Login

* Login using doctor account

---

### Step 2: View Today's Appointments

* Endpoint: GET /api/doctor/appointments/today

Expected result:

* Display list of appointments

---

### Step 3: Create Medical Record

* Endpoint: POST /api/doctor/medical-records

Expected result:

* Medical record created successfully

---

### Step 4: Create Prescription

* Endpoint: POST /api/doctor/prescriptions

Expected result:

* Prescription created

---

### Step 5: Create Test Request

* Endpoint: POST /api/doctor/test-requests

Expected result:

* Test request created

---

## 6. Admin Flow

### Step 1: Login

* Login using admin account

---

### Step 2: Manage Doctors

* Endpoint: GET /api/admin/doctors
* Demonstrate creating or updating a doctor

Expected result:

* Doctor data updated successfully

---

### Step 3: Manage Medicines

* Endpoint: GET /api/admin/medicines

Expected result:

* Medicine list displayed

---

### Step 4: View Revenue Report

* Endpoint: GET /api/admin/reports/revenue

Expected result:

* Revenue data returned

---

## 7. Key Points to Highlight During Demo

* Role-based access control (Patient / Doctor / Admin)
* JWT authentication
* End-to-end workflow (booking → treatment → prescription)
* Consistent API response format
* Clean separation of responsibilities

---

## 8. Demo Tips

* Prepare tokens in advance to save time
* Avoid typing long JSON manually during demo
* Use pre-created data for faster flow
* Keep explanation concise and focused
* Do not exceed 7 minutes

---

## 9. Expected Outcome

At the end of the demo:

* All main flows run successfully
* No errors occur during execution
* System behavior matches expected results

---

## 10. Conclusion

The demo demonstrates a complete clinic management workflow, covering patient booking, doctor treatment, and administrative management with proper authentication and role-based access.
