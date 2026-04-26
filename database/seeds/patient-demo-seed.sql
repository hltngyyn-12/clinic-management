USE clinic_management;

-- Run this after the backend has started at least once so Hibernate can create
-- the current schema used by the source code (not the older docs schema).

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_SAFE_UPDATES = 0;

CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_id BIGINT NOT NULL UNIQUE,
    rating INT NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_reviews_patient FOREIGN KEY (patient_id) REFERENCES patients(id),
    CONSTRAINT fk_reviews_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    CONSTRAINT fk_reviews_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

CREATE TABLE IF NOT EXISTS test_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medical_record_id BIGINT,
    test_name VARCHAR(255),
    status VARCHAR(255),
    CONSTRAINT fk_test_requests_record FOREIGN KEY (medical_record_id) REFERENCES medical_records(id)
);

DELETE FROM reviews
WHERE appointment_id IN (
    SELECT id FROM appointments WHERE reason LIKE 'DEMO:%'
);

DELETE FROM test_results
WHERE test_request_id IN (
    SELECT id FROM test_requests
    WHERE medical_record_id IN (
        SELECT id FROM medical_records WHERE notes LIKE 'DEMO:%'
    )
);

DELETE FROM test_requests
WHERE medical_record_id IN (
    SELECT id FROM medical_records WHERE notes LIKE 'DEMO:%'
);

DELETE FROM prescriptions
WHERE medical_record_id IN (
    SELECT id FROM medical_records WHERE notes LIKE 'DEMO:%'
);

DELETE FROM medical_records
WHERE notes LIKE 'DEMO:%';

DELETE FROM appointments
WHERE reason LIKE 'DEMO:%';

DELETE FROM doctors
WHERE user_id IN (
    SELECT id FROM users
    WHERE username IN ('doctor.demo.1', 'doctor.demo.2')
);

DELETE FROM patients
WHERE user_id IN (
    SELECT id FROM users
    WHERE username IN ('patient.demo.1', 'patient.demo.2')
);

DELETE FROM refresh_tokens
WHERE user_id IN (
    SELECT id FROM users
    WHERE username IN ('doctor.demo.1', 'doctor.demo.2', 'patient.demo.1', 'patient.demo.2', 'admin.demo.1')
);

DELETE FROM users
WHERE username IN ('doctor.demo.1', 'doctor.demo.2', 'patient.demo.1', 'patient.demo.2', 'admin.demo.1');

SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;

-- Passwords:
-- doctor.demo.1 / doctor123
-- doctor.demo.2 / doctor123
-- patient.demo.1 / patient123
-- patient.demo.2 / patient123
-- admin.demo.1 / doctor123

INSERT INTO users (username, email, password_hash, full_name, role, active, created_at)
VALUES
('doctor.demo.1', 'doctor.demo.1@clinic.local', '$2a$10$gQDtMZtAGEDLAMZ04gQ8XuqYQ03/I5k3.hYukgeToDqIwQbLQu3xq', 'Dr. Nguyen Hoang Minh', 'DOCTOR', 1, NOW()),
('doctor.demo.2', 'doctor.demo.2@clinic.local', '$2a$10$gQDtMZtAGEDLAMZ04gQ8XuqYQ03/I5k3.hYukgeToDqIwQbLQu3xq', 'Dr. Tran Thu Ha', 'DOCTOR', 1, NOW()),
('patient.demo.1', 'patient.demo.1@clinic.local', '$2a$10$tHlCJC.22R6KFBBX/2xiSuJn/PEhhgldLNm8TIOeeRcHq7zlhSupm', 'Le Thi Demo', 'PATIENT', 1, NOW()),
('patient.demo.2', 'patient.demo.2@clinic.local', '$2a$10$tHlCJC.22R6KFBBX/2xiSuJn/PEhhgldLNm8TIOeeRcHq7zlhSupm', 'Pham Van Sample', 'PATIENT', 1, NOW()),
('admin.demo.1', 'admin.demo.1@clinic.local', '$2a$10$gQDtMZtAGEDLAMZ04gQ8XuqYQ03/I5k3.hYukgeToDqIwQbLQu3xq', 'Admin Demo', 'ADMIN', 1, NOW());

INSERT INTO doctors (specialty, experience, user_id, active)
VALUES
('Cardiology', 12, (SELECT id FROM users WHERE username = 'doctor.demo.1'), 1),
('Dermatology', 8, (SELECT id FROM users WHERE username = 'doctor.demo.2'), 1);

INSERT INTO patients (date_of_birth, gender, user_id)
VALUES
('1998-04-12', 'FEMALE', (SELECT id FROM users WHERE username = 'patient.demo.1')),
('1993-09-21', 'MALE', (SELECT id FROM users WHERE username = 'patient.demo.2'));

INSERT INTO specialties (name, description, active, created_at)
SELECT 'Cardiology', 'Cardiology specialty for admin catalog demo', 1, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM specialties WHERE name = 'Cardiology'
);

INSERT INTO specialties (name, description, active, created_at)
SELECT 'Dermatology', 'Dermatology specialty for admin catalog demo', 1, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM specialties WHERE name = 'Dermatology'
);

UPDATE doctors
SET specialty_id = (SELECT id FROM specialties WHERE name = 'Cardiology' LIMIT 1)
WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1');

UPDATE doctors
SET specialty_id = (SELECT id FROM specialties WHERE name = 'Dermatology' LIMIT 1)
WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.2');

INSERT INTO medicines (name, unit, stock_quantity, price, description, active)
SELECT 'Cetirizine 10mg', 'tablet', 200, 2500, 'Demo seed medicine for allergy treatment', 1
WHERE NOT EXISTS (
    SELECT 1 FROM medicines WHERE name = 'Cetirizine 10mg'
);

INSERT INTO medicines (name, unit, stock_quantity, price, description, active)
SELECT 'Aspirin 81mg', 'tablet', 300, 1800, 'Demo seed medicine for cardiovascular support', 1
WHERE NOT EXISTS (
    SELECT 1 FROM medicines WHERE name = 'Aspirin 81mg'
);

INSERT INTO medicines (name, unit, stock_quantity, price, description, active)
SELECT 'Nitroglycerin 0.5mg', 'tablet', 120, 5000, 'Demo seed medicine for chest pain relief', 1
WHERE NOT EXISTS (
    SELECT 1 FROM medicines WHERE name = 'Nitroglycerin 0.5mg'
);

INSERT INTO slot_configs (name, working_start, working_end, slot_duration_minutes, active, notes, created_at)
SELECT 'Standard Morning', '08:00', '12:00', 30, 1, 'Admin demo slot config for morning sessions', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM slot_configs WHERE name = 'Standard Morning'
);

INSERT INTO notifications (title, message, target_role, active, created_at)
SELECT 'Demo System Notice', 'Please arrive 10 minutes before your scheduled appointment.', 'PATIENT', 1, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM notifications WHERE title = 'Demo System Notice'
);

INSERT INTO appointments (
    patient_id,
    doctor_id,
    appointment_date,
    slot_time,
    status,
    reason,
    deposit_amount,
    payment_status,
    reviewed,
    review_rating,
    review_comment
)
VALUES (
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    CURDATE(),
    '11:00:00',
    'BOOKED',
    'DEMO: Today cardiology review for doctor workspace',
    100000,
    'PAID',
    0,
    NULL,
    NULL
);

INSERT INTO appointments (
    patient_id,
    doctor_id,
    appointment_date,
    slot_time,
    status,
    reason,
    deposit_amount,
    payment_status,
    reviewed,
    review_rating,
    review_comment
)
VALUES (
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    DATE_ADD(CURDATE(), INTERVAL 2 DAY),
    '09:00:00',
    'BOOKED',
    'DEMO: Follow-up cardiology consultation',
    100000,
    'UNPAID',
    0,
    NULL,
    NULL
);

INSERT INTO appointments (
    patient_id,
    doctor_id,
    appointment_date,
    slot_time,
    status,
    reason,
    deposit_amount,
    payment_status,
    reviewed,
    review_rating,
    review_comment
)
VALUES (
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.2')),
    DATE_SUB(CURDATE(), INTERVAL 5 DAY),
    '14:00:00',
    'BOOKED',
    'DEMO: Skin irritation follow-up',
    100000,
    'PAID',
    0,
    NULL,
    NULL
);

INSERT INTO appointments (
    patient_id,
    doctor_id,
    appointment_date,
    slot_time,
    status,
    reason,
    deposit_amount,
    payment_status,
    reviewed,
    review_rating,
    review_comment
)
VALUES (
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    DATE_SUB(CURDATE(), INTERVAL 12 DAY),
    '10:00:00',
    'BOOKED',
    'DEMO: Chest pain and shortness of breath',
    100000,
    'PAID',
    1,
    5,
    'Doctor explained the condition clearly and the online follow-up information was easy to understand.'
);

INSERT INTO appointments (
    patient_id,
    doctor_id,
    appointment_date,
    slot_time,
    status,
    reason,
    deposit_amount,
    payment_status,
    reviewed,
    review_rating,
    review_comment
)
VALUES (
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    DATE_SUB(CURDATE(), INTERVAL 20 DAY),
    '15:00:00',
    'BOOKED',
    'DEMO: Annual cardiovascular screening',
    100000,
    'PAID',
    1,
    4,
    'Quick consultation and friendly guidance from the doctor.'
);

INSERT INTO medical_records (
    patient_id,
    doctor_id,
    appointment_id,
    diagnosis,
    notes,
    created_at
)
VALUES
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.2')),
    (SELECT id FROM appointments WHERE reason = 'DEMO: Skin irritation follow-up'),
    'Mild allergic dermatitis',
    'DEMO: Advised to avoid new cosmetic products for one week and return if rash worsens.',
    DATE_SUB(CURDATE(), INTERVAL 5 DAY)
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    (SELECT id FROM appointments WHERE reason = 'DEMO: Chest pain and shortness of breath'),
    'Stable angina, low immediate risk',
    'DEMO: Recommended ECG follow-up, reduced caffeine intake, and blood pressure monitoring.',
    DATE_SUB(CURDATE(), INTERVAL 12 DAY)
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    (SELECT id FROM appointments WHERE reason = 'DEMO: Annual cardiovascular screening'),
    'Normal cardiovascular screening',
    'DEMO: No acute issue detected, continue routine exercise and yearly check-up.',
    DATE_SUB(CURDATE(), INTERVAL 20 DAY)
);

INSERT INTO prescriptions (medical_record_id, medicine_name, dosage, instructions, medicine_id)
VALUES
(
    (SELECT id FROM medical_records WHERE notes = 'DEMO: Advised to avoid new cosmetic products for one week and return if rash worsens.'),
    'Cetirizine 10mg',
    '1 tablet every evening',
    'Use after dinner for 7 days.',
    (SELECT id FROM medicines WHERE name = 'Cetirizine 10mg' LIMIT 1)
),
(
    (SELECT id FROM medical_records WHERE notes = 'DEMO: Recommended ECG follow-up, reduced caffeine intake, and blood pressure monitoring.'),
    'Aspirin 81mg',
    '1 tablet every morning',
    'Take after breakfast for 30 days.',
    (SELECT id FROM medicines WHERE name = 'Aspirin 81mg' LIMIT 1)
),
(
    (SELECT id FROM medical_records WHERE notes = 'DEMO: Recommended ECG follow-up, reduced caffeine intake, and blood pressure monitoring.'),
    'Nitroglycerin 0.5mg',
    '1 tablet when chest discomfort appears',
    'Place under tongue only when needed, then seek medical advice if symptoms persist.',
    (SELECT id FROM medicines WHERE name = 'Nitroglycerin 0.5mg' LIMIT 1)
);

INSERT INTO test_requests (medical_record_id, test_name, status)
VALUES
(
    (SELECT id FROM medical_records WHERE notes = 'DEMO: Recommended ECG follow-up, reduced caffeine intake, and blood pressure monitoring.'),
    'Electrocardiogram (ECG)',
    'PENDING'
),
(
    (SELECT id FROM medical_records WHERE notes = 'DEMO: Recommended ECG follow-up, reduced caffeine intake, and blood pressure monitoring.'),
    'Lipid profile blood test',
    'PENDING'
);

INSERT INTO test_results (
    test_request_id,
    result,
    conclusion,
    created_at,
    request_note,
    result_date,
    result_text,
    status,
    test_name,
    medical_record_id
)
VALUES
(
    (SELECT id FROM test_requests WHERE test_name = 'Electrocardiogram (ECG)'),
    'Sinus rhythm, no acute ischemic changes.',
    'Stable result, continue outpatient monitoring.',
    NOW(),
    'ECG requested for chest pain follow-up.',
    CURDATE(),
    'Sinus rhythm, no acute ischemic changes.',
    'COMPLETED',
    'Electrocardiogram (ECG)',
    (SELECT id FROM medical_records WHERE notes = 'DEMO: Recommended ECG follow-up, reduced caffeine intake, and blood pressure monitoring.')
),
(
    (SELECT id FROM test_requests WHERE test_name = 'Lipid profile blood test'),
    'LDL mildly elevated at 145 mg/dL.',
    'Recommend diet adjustment and repeat check in 3 months.',
    NOW(),
    'Blood lipid profile requested for cardiovascular risk review.',
    CURDATE(),
    'LDL mildly elevated at 145 mg/dL.',
    'COMPLETED',
    'Lipid profile blood test',
    (SELECT id FROM medical_records WHERE notes = 'DEMO: Recommended ECG follow-up, reduced caffeine intake, and blood pressure monitoring.')
);

INSERT INTO reviews (patient_id, doctor_id, appointment_id, rating, comment, created_at)
VALUES
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    (SELECT id FROM appointments WHERE reason = 'DEMO: Chest pain and shortness of breath'),
    5,
    'Doctor explained the condition clearly and the online follow-up information was easy to understand.',
    NOW()
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    (SELECT id FROM appointments WHERE reason = 'DEMO: Annual cardiovascular screening'),
    4,
    'Quick consultation and friendly guidance from the doctor.',
    NOW()
);
