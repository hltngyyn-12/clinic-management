USE clinic_management;

-- Chạy file seed này sau khi backend đã khởi động ít nhất 1 lần
-- để Hibernate tạo đúng schema hiện tại của source code.

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

-- =========================================================
-- DỌN DỮ LIỆU DEMO CŨ
-- =========================================================

DELETE FROM appointment_invoices
WHERE appointment_id IN (
    SELECT id
    FROM appointments
    WHERE patient_id IN (
        SELECT p.id
        FROM patients p
        JOIN users u ON u.id = p.user_id
        WHERE u.username LIKE 'patient.demo.%'
    )
);

DELETE FROM payment_transactions
WHERE appointment_id IN (
    SELECT id
    FROM appointments
    WHERE patient_id IN (
        SELECT p.id
        FROM patients p
        JOIN users u ON u.id = p.user_id
        WHERE u.username LIKE 'patient.demo.%'
    )
);

DELETE FROM reviews
WHERE appointment_id IN (
    SELECT id
    FROM appointments
    WHERE patient_id IN (
        SELECT p.id
        FROM patients p
        JOIN users u ON u.id = p.user_id
        WHERE u.username LIKE 'patient.demo.%'
    )
);

DELETE FROM test_results
WHERE medical_record_id IN (
    SELECT id
    FROM medical_records
    WHERE patient_id IN (
        SELECT p.id
        FROM patients p
        JOIN users u ON u.id = p.user_id
        WHERE u.username LIKE 'patient.demo.%'
    )
);

DELETE FROM test_requests
WHERE medical_record_id IN (
    SELECT id
    FROM medical_records
    WHERE patient_id IN (
        SELECT p.id
        FROM patients p
        JOIN users u ON u.id = p.user_id
        WHERE u.username LIKE 'patient.demo.%'
    )
);

DELETE FROM prescriptions
WHERE medical_record_id IN (
    SELECT id
    FROM medical_records
    WHERE patient_id IN (
        SELECT p.id
        FROM patients p
        JOIN users u ON u.id = p.user_id
        WHERE u.username LIKE 'patient.demo.%'
    )
);

DELETE FROM medical_records
WHERE patient_id IN (
    SELECT p.id
    FROM patients p
    JOIN users u ON u.id = p.user_id
    WHERE u.username LIKE 'patient.demo.%'
);

DELETE FROM appointments
WHERE patient_id IN (
    SELECT p.id
    FROM patients p
    JOIN users u ON u.id = p.user_id
    WHERE u.username LIKE 'patient.demo.%'
);

DELETE FROM doctors
WHERE user_id IN (
    SELECT id FROM users WHERE username LIKE 'doctor.demo.%'
);

DELETE FROM patients
WHERE user_id IN (
    SELECT id FROM users WHERE username LIKE 'patient.demo.%'
);

DELETE FROM refresh_tokens
WHERE user_id IN (
    SELECT id FROM users
    WHERE username LIKE 'doctor.demo.%'
       OR username LIKE 'patient.demo.%'
       OR username LIKE 'admin.demo.%'
);

DELETE FROM users
WHERE username LIKE 'doctor.demo.%'
   OR username LIKE 'patient.demo.%'
   OR username LIKE 'admin.demo.%';

DELETE FROM notifications
WHERE title IN (
    'Nhắc lịch khám trực tuyến',
    'Thông báo điều chỉnh khung giờ khám cuối tuần',
    'Lưu ý thanh toán đặt cọc',
    'Thông báo dành cho bác sĩ'
);

DELETE FROM slot_configs
WHERE name IN (
    'Ca sáng tiêu chuẩn',
    'Ca chiều tiêu chuẩn',
    'Ca tư vấn ngoài giờ'
);

DELETE FROM medicines
WHERE name IN (
    'Cetirizine 10mg',
    'Aspirin 81mg',
    'Nitroglycerin 0.5mg',
    'Paracetamol 500mg',
    'Amoxicillin 500mg',
    'Omeprazole 20mg',
    'Oresol'
);

DELETE FROM specialties
WHERE name IN (
    'Tim mạch',
    'Da liễu',
    'Nội tổng quát',
    'Tai Mũi Họng',
    'Nhi khoa'
);

SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;

-- =========================================================
-- TÀI KHOẢN DEMO
-- =========================================================
-- doctor.demo.1 / doctor123
-- doctor.demo.2 / doctor123
-- doctor.demo.3 / doctor123
-- patient.demo.1 / patient123
-- patient.demo.2 / patient123
-- patient.demo.3 / patient123
-- admin.demo.1   / doctor123

INSERT INTO users (username, email, password_hash, full_name, phone, role, created_at)
VALUES
('doctor.demo.1', 'doctor.demo.1@clinic.local', '$2a$10$gQDtMZtAGEDLAMZ04gQ8XuqYQ03/I5k3.hYukgeToDqIwQbLQu3xq', 'BS. Nguyễn Hoàng Minh', '0901000001', 'DOCTOR', NOW()),
('doctor.demo.2', 'doctor.demo.2@clinic.local', '$2a$10$gQDtMZtAGEDLAMZ04gQ8XuqYQ03/I5k3.hYukgeToDqIwQbLQu3xq', 'BS. Trần Thu Hà', '0901000002', 'DOCTOR', NOW()),
('doctor.demo.3', 'doctor.demo.3@clinic.local', '$2a$10$gQDtMZtAGEDLAMZ04gQ8XuqYQ03/I5k3.hYukgeToDqIwQbLQu3xq', 'BS. Lê Quốc Bảo', '0901000003', 'DOCTOR', NOW()),
('patient.demo.1', 'patient.demo.1@clinic.local', '$2a$10$tHlCJC.22R6KFBBX/2xiSuJn/PEhhgldLNm8TIOeeRcHq7zlhSupm', 'Lê Thị Minh Anh', '0902000001', 'PATIENT', NOW()),
('patient.demo.2', 'patient.demo.2@clinic.local', '$2a$10$tHlCJC.22R6KFBBX/2xiSuJn/PEhhgldLNm8TIOeeRcHq7zlhSupm', 'Phạm Văn Nam', '0902000002', 'PATIENT', NOW()),
('patient.demo.3', 'patient.demo.3@clinic.local', '$2a$10$tHlCJC.22R6KFBBX/2xiSuJn/PEhhgldLNm8TIOeeRcHq7zlhSupm', 'Nguyễn Thùy Linh', '0902000003', 'PATIENT', NOW()),
('admin.demo.1', 'admin.demo.1@clinic.local', '$2a$10$gQDtMZtAGEDLAMZ04gQ8XuqYQ03/I5k3.hYukgeToDqIwQbLQu3xq', 'Quản trị Demo', '0903000001', 'ADMIN', NOW());

-- =========================================================
-- DANH MỤC CHUYÊN KHOA / THUỐC / SLOT / THÔNG BÁO
-- =========================================================

INSERT INTO specialties (name, description, active, created_at)
VALUES
('Tim mạch', 'Dữ liệu demo: chuyên khoa tim mạch phục vụ khám đau ngực, tăng huyết áp và theo dõi bệnh tim mạch định kỳ.', 1, NOW()),
('Da liễu', 'Dữ liệu demo: chuyên khoa da liễu phục vụ khám dị ứng da, nổi mẩn, viêm da tiếp xúc và tư vấn chăm sóc da.', 1, NOW()),
('Nội tổng quát', 'Dữ liệu demo: chuyên khoa nội tổng quát phục vụ khám mệt mỏi, rối loạn tiêu hóa, sốt nhẹ và theo dõi sức khỏe định kỳ.', 1, NOW()),
('Tai Mũi Họng', 'Dữ liệu demo: chuyên khoa tai mũi họng phục vụ khám viêm họng, đau họng, nghẹt mũi và các vấn đề đường hô hấp trên.', 1, NOW()),
('Nhi khoa', 'Dữ liệu demo: chuyên khoa nhi phục vụ khám sức khỏe, theo dõi dinh dưỡng và điều trị bệnh lý thường gặp ở trẻ em.', 1, NOW());

INSERT INTO medicines (name, unit, stock_quantity, price, description, active)
VALUES
('Cetirizine 10mg', 'viên', 240, 2500, 'Dữ liệu demo: thuốc kháng histamine dùng trong dị ứng da, ngứa và hắt hơi.', 1),
('Aspirin 81mg', 'viên', 320, 1800, 'Dữ liệu demo: thuốc hỗ trợ dự phòng tim mạch theo chỉ định bác sĩ.', 1),
('Nitroglycerin 0.5mg', 'viên ngậm', 120, 5000, 'Dữ liệu demo: thuốc dùng khi xuất hiện cơn đau ngực theo hướng dẫn của bác sĩ.', 1),
('Paracetamol 500mg', 'viên', 500, 1200, 'Dữ liệu demo: thuốc giảm đau, hạ sốt thông dụng trong điều trị triệu chứng.', 1),
('Amoxicillin 500mg', 'viên', 260, 2200, 'Dữ liệu demo: kháng sinh thường dùng trong một số nhiễm khuẩn theo đơn.', 1),
('Omeprazole 20mg', 'viên', 180, 3000, 'Dữ liệu demo: thuốc hỗ trợ giảm tiết acid dạ dày, dùng trong rối loạn tiêu hóa.', 1),
('Oresol', 'gói', 160, 3500, 'Dữ liệu demo: dung dịch bù nước và điện giải cho trường hợp tiêu chảy hoặc mất nước nhẹ.', 1);

INSERT INTO slot_configs (name, working_start, working_end, slot_duration_minutes, active, notes, created_at)
VALUES
('Ca sáng tiêu chuẩn', '08:00', '12:00', 30, 1, 'Dữ liệu demo: cấu hình khung giờ buổi sáng cho lịch khám thông thường.', NOW()),
('Ca chiều tiêu chuẩn', '13:30', '17:00', 30, 1, 'Dữ liệu demo: cấu hình khung giờ buổi chiều cho lịch tái khám và khám chuyên khoa.', NOW()),
('Ca tư vấn ngoài giờ', '18:00', '20:00', 20, 1, 'Dữ liệu demo: cấu hình khung giờ tư vấn ngoài giờ cho các ca hẹn linh hoạt.', NOW());

INSERT INTO notifications (title, message, target_role, active, created_at)
VALUES
('Nhắc lịch khám trực tuyến', 'Vui lòng đến trước giờ hẹn 10 phút để hoàn tất thủ tục tiếp nhận và đối chiếu thông tin đặt lịch.', 'PATIENT', 1, NOW()),
('Thông báo điều chỉnh khung giờ khám cuối tuần', 'Phòng khám áp dụng khung giờ khám cuối tuần từ 08:00 đến 11:30. Vui lòng kiểm tra lại lịch hẹn trước khi đến.', 'ALL', 1, NOW()),
('Lưu ý thanh toán đặt cọc', 'Đặt cọc trước giúp giữ chỗ lịch khám và rút ngắn thời gian tiếp nhận tại quầy vào ngày thăm khám.', 'PATIENT', 1, NOW()),
('Thông báo dành cho bác sĩ', 'Bác sĩ vui lòng cập nhật hồ sơ bệnh án, đơn thuốc và kết quả chỉ định ngay sau khi hoàn tất ca khám.', 'DOCTOR', 1, NOW());

-- =========================================================
-- HỒ SƠ BÁC SĨ / BỆNH NHÂN
-- =========================================================

INSERT INTO doctors (
    specialty,
    experience,
    bio,
    active,
    consultation_fee,
    degree,
    specialty_id,
    experience_years,
    room_number,
    slot_duration_minutes,
    working_start,
    working_end,
    user_id
)
VALUES
(
    'Tim mạch',
    12,
    'Bác sĩ chuyên khám tăng huyết áp, đau ngực, rối loạn mỡ máu và theo dõi bệnh tim mạch định kỳ.',
    1,
    350000,
    'ThS.BS Tim mạch',
    (SELECT id FROM specialties WHERE name = 'Tim mạch' LIMIT 1),
    12,
    'P.201',
    30,
    '08:00',
    '17:00',
    (SELECT id FROM users WHERE username = 'doctor.demo.1')
),
(
    'Da liễu',
    8,
    'Bác sĩ da liễu chuyên điều trị nổi mẩn, dị ứng da, viêm da cơ địa và tư vấn chăm sóc da sau điều trị.',
    1,
    280000,
    'BS.CKI Da liễu',
    (SELECT id FROM specialties WHERE name = 'Da liễu' LIMIT 1),
    8,
    'P.305',
    30,
    '08:30',
    '17:00',
    (SELECT id FROM users WHERE username = 'doctor.demo.2')
),
(
    'Nội tổng quát',
    10,
    'Bác sĩ nội tổng quát chuyên khám mệt mỏi kéo dài, rối loạn tiêu hóa, mất ngủ và theo dõi sức khỏe tổng quát.',
    1,
    300000,
    'BS Nội tổng quát',
    (SELECT id FROM specialties WHERE name = 'Nội tổng quát' LIMIT 1),
    10,
    'P.102',
    20,
    '09:00',
    '18:00',
    (SELECT id FROM users WHERE username = 'doctor.demo.3')
);

INSERT INTO patients (date_of_birth, gender, address, insurance_number, user_id)
VALUES
('1998-04-12', 'FEMALE', 'Quận 3, TP. Hồ Chí Minh', 'BHYT-MA-001', (SELECT id FROM users WHERE username = 'patient.demo.1')),
('1993-09-21', 'MALE', 'Thành phố Thủ Đức, TP. Hồ Chí Minh', 'BHYT-NAM-002', (SELECT id FROM users WHERE username = 'patient.demo.2')),
('2001-01-05', 'FEMALE', 'Quận Bình Thạnh, TP. Hồ Chí Minh', 'BHYT-LINH-003', (SELECT id FROM users WHERE username = 'patient.demo.3'));

-- =========================================================
-- LỊCH HẸN DEMO
-- =========================================================

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
VALUES
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    CURDATE(),
    '11:00:00',
    'BOOKED',
    'Khám tái khám tim mạch sau đợt đau ngực tuần trước',
    100000,
    'PAID',
    0,
    NULL,
    NULL
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    DATE_ADD(CURDATE(), INTERVAL 2 DAY),
    '09:00:00',
    'BOOKED',
    'Khám tim mạch định kỳ và đo điện tim',
    100000,
    'UNPAID',
    0,
    NULL,
    NULL
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.2')),
    DATE_SUB(CURDATE(), INTERVAL 5 DAY),
    '14:00:00',
    'BOOKED',
    'Khám da liễu do nổi mẩn và ngứa kéo dài',
    100000,
    'PAID',
    0,
    NULL,
    NULL
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    DATE_SUB(CURDATE(), INTERVAL 12 DAY),
    '10:00:00',
    'BOOKED',
    'Khám đau ngực và khó thở nhẹ khi gắng sức',
    100000,
    'PAID',
    1,
    5,
    'Bác sĩ tư vấn rất kỹ, giải thích rõ nguyên nhân và hướng dẫn theo dõi tại nhà dễ hiểu.'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.3')),
    DATE_ADD(CURDATE(), INTERVAL 4 DAY),
    '15:30:00',
    'BOOKED',
    'Khám nội tổng quát vì đau bụng, đầy hơi và ăn uống kém',
    100000,
    'UNPAID',
    0,
    NULL,
    NULL
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.2')),
    CURDATE(),
    '09:30:00',
    'BOOKED',
    'Tái khám da liễu sau 7 ngày bôi thuốc',
    100000,
    'PAID',
    0,
    NULL,
    NULL
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    DATE_SUB(CURDATE(), INTERVAL 20 DAY),
    '15:00:00',
    'BOOKED',
    'Khám sức khỏe tim mạch định kỳ theo gói tổng quát',
    100000,
    'PAID',
    1,
    4,
    'Thủ tục nhanh, bác sĩ hướng dẫn rõ ràng và giải thích kết quả dễ hiểu.'
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    DATE_ADD(CURDATE(), INTERVAL 1 DAY),
    '13:30:00',
    'BOOKED',
    'Khám sức khỏe tổng quát theo lịch cơ quan',
    100000,
    'UNPAID',
    0,
    NULL,
    NULL
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.3')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.3')),
    CURDATE(),
    '16:00:00',
    'BOOKED',
    'Khám nội tổng quát do mệt mỏi, mất ngủ và ăn uống kém',
    100000,
    'UNPAID',
    0,
    NULL,
    NULL
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.3')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.3')),
    DATE_SUB(CURDATE(), INTERVAL 7 DAY),
    '11:00:00',
    'BOOKED',
    'Khám rối loạn tiêu hóa sau ăn uống thất thường',
    100000,
    'PAID',
    0,
    NULL,
    NULL
);

-- =========================================================
-- HỒ SƠ BỆNH ÁN
-- =========================================================

INSERT INTO medical_records (
    patient_id,
    doctor_id,
    appointment_id,
    diagnosis,
    notes,
    symptoms,
    follow_up_date,
    created_at
)
VALUES
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.2')),
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 5 DAY) AND slot_time = '14:00:00'),
    'Viêm da tiếp xúc dị ứng mức độ nhẹ',
    'Khuyên ngừng dùng mỹ phẩm mới trong 1 tuần, giữ da khô thoáng và tái khám nếu mẩn đỏ lan rộng.',
    'Nổi mẩn đỏ vùng cổ, ngứa nhiều về đêm, da hơi khô và nóng rát nhẹ.',
    DATE_ADD(CURDATE(), INTERVAL 2 DAY),
    DATE_SUB(CURDATE(), INTERVAL 5 DAY)
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 12 DAY) AND slot_time = '10:00:00'),
    'Đau thắt ngực ổn định, nguy cơ tim mạch thấp',
    'Khuyến nghị theo dõi huyết áp tại nhà, hạn chế cà phê, tập đi bộ nhẹ và tái khám sau khi có kết quả xét nghiệm.',
    'Đau tức ngực thoáng qua khi leo cầu thang, hồi hộp nhẹ, khó thở mức độ nhẹ khi gắng sức.',
    DATE_ADD(CURDATE(), INTERVAL 7 DAY),
    DATE_SUB(CURDATE(), INTERVAL 12 DAY)
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 20 DAY) AND slot_time = '15:00:00'),
    'Khám tim mạch định kỳ, huyết áp ổn định',
    'Chưa ghi nhận bất thường cấp tính, tiếp tục duy trì vận động đều và theo dõi sức khỏe định kỳ 6 tháng/lần.',
    'Không có triệu chứng cấp, kiểm tra định kỳ theo yêu cầu cơ quan.',
    DATE_ADD(CURDATE(), INTERVAL 180 DAY),
    DATE_SUB(CURDATE(), INTERVAL 20 DAY)
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.3')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.3')),
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.3')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND slot_time = '11:00:00'),
    'Rối loạn tiêu hóa chức năng',
    'Khuyên ăn đúng bữa, tránh đồ cay nóng, theo dõi tình trạng đầy bụng và tái khám nếu đau tăng lên.',
    'Đầy bụng sau ăn, đau âm ỉ vùng thượng vị, đôi lúc buồn nôn và mệt mỏi nhẹ.',
    DATE_ADD(CURDATE(), INTERVAL 5 DAY),
    DATE_SUB(CURDATE(), INTERVAL 7 DAY)
);

-- =========================================================
-- ĐƠN THUỐC
-- =========================================================

INSERT INTO prescriptions (medical_record_id, medicine_name, dosage, frequency, duration, instructions, medicine_id)
VALUES
(
    (SELECT id FROM medical_records WHERE diagnosis = 'Viêm da tiếp xúc dị ứng mức độ nhẹ' LIMIT 1),
    'Cetirizine 10mg',
    '1 viên/lần',
    '1 lần vào buổi tối',
    '7 ngày',
    'Uống sau ăn tối, theo dõi tình trạng ngứa và tái khám nếu nổi mẩn nhiều hơn.',
    (SELECT id FROM medicines WHERE name = 'Cetirizine 10mg' LIMIT 1)
),
(
    (SELECT id FROM medical_records WHERE diagnosis = 'Viêm da tiếp xúc dị ứng mức độ nhẹ' LIMIT 1),
    'Paracetamol 500mg',
    '1 viên/lần',
    'Khi khó chịu hoặc đau rát',
    '3 ngày',
    'Chỉ dùng khi cần, không vượt quá 4 viên trong ngày.',
    (SELECT id FROM medicines WHERE name = 'Paracetamol 500mg' LIMIT 1)
),
(
    (SELECT id FROM medical_records WHERE diagnosis = 'Đau thắt ngực ổn định, nguy cơ tim mạch thấp' LIMIT 1),
    'Aspirin 81mg',
    '1 viên/lần',
    '1 lần vào buổi sáng',
    '30 ngày',
    'Uống sau ăn sáng và tái khám đúng hẹn để đánh giá lại nguy cơ tim mạch.',
    (SELECT id FROM medicines WHERE name = 'Aspirin 81mg' LIMIT 1)
),
(
    (SELECT id FROM medical_records WHERE diagnosis = 'Đau thắt ngực ổn định, nguy cơ tim mạch thấp' LIMIT 1),
    'Nitroglycerin 0.5mg',
    '1 viên ngậm/lần',
    'Khi xuất hiện đau ngực',
    'Dùng khi cần',
    'Ngậm dưới lưỡi khi đau ngực, nếu không giảm cần đến cơ sở y tế ngay.',
    (SELECT id FROM medicines WHERE name = 'Nitroglycerin 0.5mg' LIMIT 1)
),
(
    (SELECT id FROM medical_records WHERE diagnosis = 'Khám tim mạch định kỳ, huyết áp ổn định' LIMIT 1),
    'Aspirin 81mg',
    '1 viên/lần',
    '1 lần vào buổi sáng',
    '30 ngày',
    'Tiếp tục dùng theo đơn cũ và duy trì chế độ ăn ít muối, ít mỡ.',
    (SELECT id FROM medicines WHERE name = 'Aspirin 81mg' LIMIT 1)
),
(
    (SELECT id FROM medical_records WHERE diagnosis = 'Rối loạn tiêu hóa chức năng' LIMIT 1),
    'Omeprazole 20mg',
    '1 viên/lần',
    '1 lần trước bữa sáng',
    '14 ngày',
    'Uống trước ăn sáng 30 phút, tránh thức ăn cay nóng và nước ngọt có gas.',
    (SELECT id FROM medicines WHERE name = 'Omeprazole 20mg' LIMIT 1)
),
(
    (SELECT id FROM medical_records WHERE diagnosis = 'Rối loạn tiêu hóa chức năng' LIMIT 1),
    'Oresol',
    '1 gói/lần',
    '1 đến 2 lần mỗi ngày',
    '3 ngày',
    'Pha đúng hướng dẫn, uống từng ngụm nhỏ sau mỗi lần đi ngoài hoặc khi mệt.',
    (SELECT id FROM medicines WHERE name = 'Oresol' LIMIT 1)
);

-- =========================================================
-- YÊU CẦU XÉT NGHIỆM / KẾT QUẢ
-- =========================================================

INSERT INTO test_requests (medical_record_id, test_name, status)
VALUES
(
    (SELECT id FROM medical_records WHERE diagnosis = 'Đau thắt ngực ổn định, nguy cơ tim mạch thấp' LIMIT 1),
    'Điện tâm đồ',
    'COMPLETED'
),
(
    (SELECT id FROM medical_records WHERE diagnosis = 'Đau thắt ngực ổn định, nguy cơ tim mạch thấp' LIMIT 1),
    'Xét nghiệm mỡ máu',
    'COMPLETED'
),
(
    (SELECT id FROM medical_records WHERE diagnosis = 'Rối loạn tiêu hóa chức năng' LIMIT 1),
    'Siêu âm bụng tổng quát',
    'PENDING'
),
(
    (SELECT id FROM medical_records WHERE diagnosis = 'Khám tim mạch định kỳ, huyết áp ổn định' LIMIT 1),
    'Đường huyết lúc đói',
    'COMPLETED'
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
    (SELECT id FROM test_requests WHERE test_name = 'Điện tâm đồ' AND medical_record_id = (SELECT id FROM medical_records WHERE diagnosis = 'Đau thắt ngực ổn định, nguy cơ tim mạch thấp' LIMIT 1) LIMIT 1),
    'Nhịp xoang đều, chưa ghi nhận dấu hiệu thiếu máu cơ tim cấp.',
    'Kết quả ổn định, tiếp tục theo dõi ngoại trú và tái khám đúng hẹn.',
    NOW(),
    'Thực hiện điện tâm đồ để đánh giá cơn đau ngực khi gắng sức.',
    CURDATE(),
    'Nhịp xoang đều, chưa ghi nhận dấu hiệu thiếu máu cơ tim cấp.',
    'COMPLETED',
    'Điện tâm đồ',
    (SELECT id FROM medical_records WHERE diagnosis = 'Đau thắt ngực ổn định, nguy cơ tim mạch thấp' LIMIT 1)
),
(
    (SELECT id FROM test_requests WHERE test_name = 'Xét nghiệm mỡ máu' AND medical_record_id = (SELECT id FROM medical_records WHERE diagnosis = 'Đau thắt ngực ổn định, nguy cơ tim mạch thấp' LIMIT 1) LIMIT 1),
    'LDL cholesterol tăng nhẹ ở mức 145 mg/dL.',
    'Khuyên điều chỉnh chế độ ăn, tăng vận động và kiểm tra lại sau 3 tháng.',
    NOW(),
    'Xét nghiệm mỡ máu để đánh giá nguy cơ tim mạch nền.',
    CURDATE(),
    'LDL cholesterol tăng nhẹ ở mức 145 mg/dL.',
    'COMPLETED',
    'Xét nghiệm mỡ máu',
    (SELECT id FROM medical_records WHERE diagnosis = 'Đau thắt ngực ổn định, nguy cơ tim mạch thấp' LIMIT 1)
),
(
    (SELECT id FROM test_requests WHERE test_name = 'Đường huyết lúc đói' AND medical_record_id = (SELECT id FROM medical_records WHERE diagnosis = 'Khám tim mạch định kỳ, huyết áp ổn định' LIMIT 1) LIMIT 1),
    'Đường huyết lúc đói 5.3 mmol/L, trong giới hạn bình thường.',
    'Kết quả ổn định, tiếp tục duy trì thói quen sinh hoạt lành mạnh.',
    NOW(),
    'Xét nghiệm tầm soát định kỳ trong gói khám tim mạch tổng quát.',
    CURDATE(),
    'Đường huyết lúc đói 5.3 mmol/L, trong giới hạn bình thường.',
    'COMPLETED',
    'Đường huyết lúc đói',
    (SELECT id FROM medical_records WHERE diagnosis = 'Khám tim mạch định kỳ, huyết áp ổn định' LIMIT 1)
);

-- =========================================================
-- ĐÁNH GIÁ BÁC SĨ
-- =========================================================

INSERT INTO reviews (patient_id, doctor_id, appointment_id, rating, comment, created_at)
VALUES
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 12 DAY) AND slot_time = '10:00:00'),
    5,
    'Bác sĩ tư vấn rất kỹ, giải thích rõ nguyên nhân và hướng dẫn theo dõi tại nhà dễ hiểu.',
    NOW()
),
(
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')),
    (SELECT id FROM doctors WHERE user_id = (SELECT id FROM users WHERE username = 'doctor.demo.1')),
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 20 DAY) AND slot_time = '15:00:00'),
    4,
    'Thủ tục nhanh, bác sĩ hướng dẫn rõ ràng và giải thích kết quả dễ hiểu.',
    NOW()
);

-- =========================================================
-- GIAO DỊCH THANH TOÁN / HÓA ĐƠN CHO CÁC LỊCH ĐÃ THANH TOÁN
-- =========================================================

INSERT INTO payment_transactions (
    appointment_id,
    patient_id,
    provider,
    transaction_ref,
    provider_order_id,
    provider_transaction_no,
    amount,
    status,
    response_code,
    message,
    payment_url,
    paid_at,
    created_at,
    updated_at
)
VALUES
(
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')) AND appointment_date = CURDATE() AND slot_time = '11:00:00'),
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    'MOMO',
    'DEMO-MOMO-TXN-001',
    'DEMO-MOMO-ORDER-001',
    'DEMO-MOMO-PROVIDER-001',
    100000,
    'SUCCESS',
    '0',
    'Thanh toán demo thành công.',
    NULL,
    NOW(),
    NOW(),
    NOW()
),
(
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 5 DAY) AND slot_time = '14:00:00'),
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    'MOMO',
    'DEMO-MOMO-TXN-002',
    'DEMO-MOMO-ORDER-002',
    'DEMO-MOMO-PROVIDER-002',
    100000,
    'SUCCESS',
    '0',
    'Thanh toán demo thành công.',
    NULL,
    NOW(),
    NOW(),
    NOW()
),
(
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 12 DAY) AND slot_time = '10:00:00'),
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')),
    'MOMO',
    'DEMO-MOMO-TXN-003',
    'DEMO-MOMO-ORDER-003',
    'DEMO-MOMO-PROVIDER-003',
    100000,
    'SUCCESS',
    '0',
    'Thanh toán demo thành công.',
    NULL,
    NOW(),
    NOW(),
    NOW()
),
(
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')) AND appointment_date = CURDATE() AND slot_time = '09:30:00'),
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')),
    'MOMO',
    'DEMO-MOMO-TXN-004',
    'DEMO-MOMO-ORDER-004',
    'DEMO-MOMO-PROVIDER-004',
    100000,
    'SUCCESS',
    '0',
    'Thanh toán demo thành công.',
    NULL,
    NOW(),
    NOW(),
    NOW()
),
(
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 20 DAY) AND slot_time = '15:00:00'),
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')),
    'MOMO',
    'DEMO-MOMO-TXN-005',
    'DEMO-MOMO-ORDER-005',
    'DEMO-MOMO-PROVIDER-005',
    100000,
    'SUCCESS',
    '0',
    'Thanh toán demo thành công.',
    NULL,
    NOW(),
    NOW(),
    NOW()
),
(
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.3')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND slot_time = '11:00:00'),
    (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.3')),
    'MOMO',
    'DEMO-MOMO-TXN-006',
    'DEMO-MOMO-ORDER-006',
    'DEMO-MOMO-PROVIDER-006',
    100000,
    'SUCCESS',
    '0',
    'Thanh toán demo thành công.',
    NULL,
    NOW(),
    NOW(),
    NOW()
);

INSERT INTO appointment_invoices (
    appointment_id,
    payment_transaction_id,
    invoice_number,
    patient_name,
    doctor_name,
    specialty,
    amount,
    payment_method,
    payment_status,
    issued_at
)
VALUES
(
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')) AND appointment_date = CURDATE() AND slot_time = '11:00:00'),
    (SELECT id FROM payment_transactions WHERE transaction_ref = 'DEMO-MOMO-TXN-001'),
    'HD-DEMO-001',
    'Lê Thị Minh Anh',
    'BS. Nguyễn Hoàng Minh',
    'Tim mạch',
    100000,
    'MOMO',
    'PAID',
    NOW()
),
(
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 5 DAY) AND slot_time = '14:00:00'),
    (SELECT id FROM payment_transactions WHERE transaction_ref = 'DEMO-MOMO-TXN-002'),
    'HD-DEMO-002',
    'Lê Thị Minh Anh',
    'BS. Trần Thu Hà',
    'Da liễu',
    100000,
    'MOMO',
    'PAID',
    NOW()
),
(
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.1')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 12 DAY) AND slot_time = '10:00:00'),
    (SELECT id FROM payment_transactions WHERE transaction_ref = 'DEMO-MOMO-TXN-003'),
    'HD-DEMO-003',
    'Lê Thị Minh Anh',
    'BS. Nguyễn Hoàng Minh',
    'Tim mạch',
    100000,
    'MOMO',
    'PAID',
    NOW()
),
(
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')) AND appointment_date = CURDATE() AND slot_time = '09:30:00'),
    (SELECT id FROM payment_transactions WHERE transaction_ref = 'DEMO-MOMO-TXN-004'),
    'HD-DEMO-004',
    'Phạm Văn Nam',
    'BS. Trần Thu Hà',
    'Da liễu',
    100000,
    'MOMO',
    'PAID',
    NOW()
),
(
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.2')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 20 DAY) AND slot_time = '15:00:00'),
    (SELECT id FROM payment_transactions WHERE transaction_ref = 'DEMO-MOMO-TXN-005'),
    'HD-DEMO-005',
    'Phạm Văn Nam',
    'BS. Nguyễn Hoàng Minh',
    'Tim mạch',
    100000,
    'MOMO',
    'PAID',
    NOW()
),
(
    (SELECT id FROM appointments WHERE patient_id = (SELECT id FROM patients WHERE user_id = (SELECT id FROM users WHERE username = 'patient.demo.3')) AND appointment_date = DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND slot_time = '11:00:00'),
    (SELECT id FROM payment_transactions WHERE transaction_ref = 'DEMO-MOMO-TXN-006'),
    'HD-DEMO-006',
    'Nguyễn Thùy Linh',
    'BS. Lê Quốc Bảo',
    'Nội tổng quát',
    100000,
    'MOMO',
    'PAID',
    NOW()
);
