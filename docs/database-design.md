# Database Design

## 1. Overview

The clinic management system database is designed to manage users, doctors, patients, appointments, medical records, medicines, prescriptions and test results.

The database ensures proper relationships between entities such as patients booking appointments with doctors and storing medical records.

---

# 2. Main Tables

1. users
2. specialties
3. doctors
4. patients
5. appointments
6. medical_records
7. medicines
8. prescriptions
9. test_results

---

# 3. Table Details

## users

Stores system user accounts.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| username | VARCHAR(50) | Unique login username |
| email | VARCHAR(100) | User email |
| password_hash | VARCHAR(255) | Encrypted password |
| full_name | VARCHAR(100) | Full name |
| phone | VARCHAR(20) | Phone number |
| role | VARCHAR(20) | User role (admin, doctor, patient) |
| status | VARCHAR(20) | Account status |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

---

## specialties

Stores doctor specialties.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | Specialty name |
| description | TEXT | Specialty description |
| created_at | TIMESTAMP | Created time |
| updated_at | TIMESTAMP | Last update time |

---

## doctors

Stores doctor information.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| user_id | BIGINT | Reference to users table |
| specialty_id | BIGINT | Reference to specialties |
| degree | VARCHAR(100) | Medical degree |
| experience_years | INT | Years of experience |
| consultation_fee | DECIMAL | Consultation fee |
| bio | TEXT | Doctor biography |
| is_active | BOOLEAN | Active status |

---

## patients

Stores patient information.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| user_id | BIGINT | Reference to users |
| dob | DATE | Date of birth |
| gender | VARCHAR(10) | Gender |
| address | TEXT | Home address |
| insurance_number | VARCHAR(50) | Insurance number |

---

## appointments

Stores appointment information.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| patient_id | BIGINT | Reference to patients |
| doctor_id | BIGINT | Reference to doctors |
| appointment_date | DATE | Appointment date |
| slot_time | TIME | Appointment time |
| status | VARCHAR(20) | Appointment status |
| reason | TEXT | Appointment reason |
| deposit_amount | DECIMAL | Deposit amount |
| payment_status | VARCHAR(20) | Payment status |
| created_at | TIMESTAMP | Creation time |

---

## medical_records

Stores medical record information.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| appointment_id | BIGINT | Reference to appointment |
| doctor_id | BIGINT | Doctor reference |
| patient_id | BIGINT | Patient reference |
| symptoms | TEXT | Patient symptoms |
| diagnosis | TEXT | Diagnosis |
| notes | TEXT | Additional notes |
| follow_up_date | DATE | Follow-up date |
| created_at | TIMESTAMP | Created time |

---

## medicines

Stores medicine inventory.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | Medicine name |
| unit | VARCHAR(20) | Unit type |
| stock_quantity | INT | Available quantity |
| price | DECIMAL | Medicine price |
| description | TEXT | Medicine description |
| is_active | BOOLEAN | Availability status |

---

## prescriptions

Stores prescriptions issued by doctors.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| medical_record_id | BIGINT | Reference to medical record |
| medicine_id | BIGINT | Reference to medicine |
| dosage | VARCHAR(50) | Dosage |
| frequency | VARCHAR(50) | Frequency |
| duration | VARCHAR(50) | Treatment duration |
| instructions | TEXT | Usage instructions |

---

## test_results

Stores laboratory test results.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| medical_record_id | BIGINT | Reference to medical record |
| test_name | VARCHAR(100) | Test name |
| request_note | TEXT | Doctor request note |
| result_text | TEXT | Test result |
| result_date | DATE | Result date |
| status | VARCHAR(20) | Test status |

---

# 4. Relationships

- users (1) — (1) doctors  
- users (1) — (1) patients  
- specialties (1) — (N) doctors  
- doctors (1) — (N) appointments  
- patients (1) — (N) appointments  
- appointments (1) — (1) medical_records  
- medical_records (1) — (N) prescriptions  
- medicines (1) — (N) prescriptions  
- medical_records (1) — (N) test_results