# Database Design

## 1. Main Tables
1. users
2. specialties
3. doctors
4. patients
5. appointments
6. medical_records
7. medicines
8. prescriptions
9. test_results

## 2. Table Description

### users
- id
- username
- email
- password
- full_name
- phone
- role
- status
- created_at
- updated_at

### specialties
- id
- name
- description
- created_at
- updated_at

### doctors
- id
- user_id
- specialty_id
- degree
- experience_years
- consultation_fee
- bio
- is_active

### patients
- id
- user_id
- dob
- gender
- address
- insurance_number

### appointments
- id
- patient_id
- doctor_id
- appointment_date
- slot_time
- status
- reason
- deposit_amount
- payment_status
- created_at

### medical_records
- id
- appointment_id
- doctor_id
- patient_id
- symptoms
- diagnosis
- notes
- follow_up_date
- created_at

### medicines
- id
- name
- unit
- stock_quantity
- price
- description
- is_active

### prescriptions
- id
- medical_record_id
- medicine_id
- dosage
- frequency
- duration
- instructions

### test_results
- id
- medical_record_id
- test_name
- request_note
- result_text
- result_date
- status

## 3. Relationships
- users 1-1 doctors
- users 1-1 patients
- specialties 1-n doctors
- doctors 1-n appointments
- patients 1-n appointments
- appointments 1-1 medical_records
- medical_records 1-n prescriptions
- medicines 1-n prescriptions
- medical_records 1-n test_results