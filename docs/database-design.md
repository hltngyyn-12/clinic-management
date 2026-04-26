# Database Design

## 1. Overview
Hệ thống hiện tại sử dụng MySQL và được Hibernate cập nhật schema tự động theo source code.

Database chính: `clinic_management`

Các nhóm dữ liệu chính:
- tài khoản và phân quyền
- thông tin bác sĩ và bệnh nhân
- lịch khám
- hồ sơ khám bệnh
- đơn thuốc
- xét nghiệm
- đánh giá bác sĩ
- catalog và cấu hình cho admin

## 2. Main Tables In Current Source

1. `users`
2. `patients`
3. `doctors`
4. `appointments`
5. `medical_records`
6. `prescriptions`
7. `test_requests`
8. `test_results`
9. `reviews`
10. `refresh_tokens`
11. `medicines`
12. `specialties`
13. `slot_configs`
14. `notifications`

## 3. Table Details

### users
Lưu tài khoản đăng nhập của toàn hệ thống.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| username | VARCHAR(50) | Username duy nhất |
| email | VARCHAR(100) | Email duy nhất |
| password_hash | VARCHAR(255) | Mật khẩu mã hóa |
| full_name | VARCHAR(100) | Họ tên |
| phone | VARCHAR(20) | Số điện thoại |
| role | ENUM | `ADMIN`, `DOCTOR`, `PATIENT` |
| active | BIT | Trạng thái hoạt động |
| created_at | DATETIME | Ngày tạo |

### patients
Lưu hồ sơ bệnh nhân.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| user_id | BIGINT | FK đến `users` |
| date_of_birth | DATETIME | Ngày sinh |
| gender | VARCHAR(255) | Giới tính |
| address | VARCHAR(255) | Địa chỉ |
| insurance_number | VARCHAR(255) | Mã BHYT |

### doctors
Lưu hồ sơ bác sĩ.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| user_id | BIGINT | FK đến `users` |
| specialty | VARCHAR(255) | Tên chuyên khoa text |
| specialty_id | BIGINT | FK logic đến `specialties` |
| experience | INT | Số năm kinh nghiệm |
| bio | VARCHAR(255) | Giới thiệu |
| active | BIT | Trạng thái hoạt động |
| consultation_fee | DECIMAL(38,2) | Phí khám |
| degree | VARCHAR(255) | Học vị |
| experience_years | INT | Số năm kinh nghiệm |
| room_number | VARCHAR(255) | Phòng khám |
| slot_duration_minutes | INT | Độ dài slot |
| working_start | VARCHAR(255) | Giờ bắt đầu |
| working_end | VARCHAR(255) | Giờ kết thúc |

### appointments
Lưu lịch khám giữa bệnh nhân và bác sĩ.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| patient_id | BIGINT | FK đến `patients` |
| doctor_id | BIGINT | FK đến `doctors` |
| appointment_date | DATE | Ngày khám |
| slot_time | TIME | Giờ khám |
| status | VARCHAR(20) | Trạng thái lịch hẹn |
| reason | TEXT | Lý do khám |
| deposit_amount | DOUBLE | Số tiền đặt cọc |
| payment_status | VARCHAR(255) | `UNPAID`, `PAID` |
| review_comment | TEXT | Nội dung review gắn với lịch hẹn |
| review_rating | INT | Số sao review |
| reviewed | BIT | Đã review hay chưa |
| created_at | DATETIME(6) | Ngày tạo |

### medical_records
Lưu hồ sơ khám bệnh.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| patient_id | BIGINT | FK đến `patients` |
| doctor_id | BIGINT | FK đến `doctors` |
| appointment_id | BIGINT | FK đến `appointments` |
| diagnosis | VARCHAR(255) | Chẩn đoán |
| notes | VARCHAR(255) | Ghi chú |
| symptoms | TEXT | Triệu chứng |
| follow_up_date | DATE | Ngày tái khám |
| created_at | DATE | Ngày tạo hồ sơ |

### prescriptions
Lưu đơn thuốc.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| medical_record_id | BIGINT | FK đến `medical_records` |
| medicine_name | VARCHAR(255) | Tên thuốc text |
| dosage | VARCHAR(255) | Liều dùng |
| instructions | VARCHAR(255) | Hướng dẫn |
| created_at | DATETIME(6) | Ngày tạo |
| duration | VARCHAR(255) | Thời gian dùng |
| frequency | VARCHAR(255) | Tần suất |
| medicine_id | BIGINT | FK logic đến `medicines` |

### test_requests
Lưu yêu cầu xét nghiệm do bác sĩ tạo.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| medical_record_id | BIGINT | FK đến `medical_records` |
| test_name | VARCHAR(255) | Tên xét nghiệm |
| status | VARCHAR(255) | Trạng thái yêu cầu |

### test_results
Lưu kết quả xét nghiệm.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| test_request_id | BIGINT | FK đến `test_requests` |
| medical_record_id | BIGINT | FK đến `medical_records` |
| test_name | VARCHAR(255) | Tên xét nghiệm |
| request_note | TEXT | Ghi chú yêu cầu |
| result | VARCHAR(255) | Kết quả ngắn |
| result_text | TEXT | Mô tả chi tiết |
| conclusion | VARCHAR(255) | Kết luận |
| result_date | DATE | Ngày có kết quả |
| status | VARCHAR(255) | Trạng thái |
| created_at | DATETIME(6) | Ngày tạo |

### reviews
Lưu đánh giá bác sĩ sau khám.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| patient_id | BIGINT | FK đến `patients` |
| doctor_id | BIGINT | FK đến `doctors` |
| appointment_id | BIGINT | FK đến `appointments` |
| rating | INT | Số sao |
| comment | TEXT | Nội dung đánh giá |
| created_at | DATETIME | Ngày tạo |

### refresh_tokens
Lưu refresh token cho đăng nhập JWT.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| token | VARCHAR | Refresh token |
| expiry_date | DATETIME | Hạn token |
| revoked | BIT | Đã thu hồi hay chưa |
| user_id | BIGINT | FK đến `users` |

### medicines
Lưu danh mục thuốc.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | Tên thuốc |
| unit | VARCHAR(255) | Đơn vị |
| stock_quantity | INT | Tồn kho |
| price | DECIMAL(38,2) | Giá thuốc |
| description | TEXT | Mô tả |
| active | BIT | Trạng thái hoạt động |
| created_at | DATETIME(6) | Ngày tạo |

### specialties
Lưu danh mục chuyên khoa.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(120) | Tên chuyên khoa |
| description | TEXT | Mô tả |
| active | BIT | Trạng thái hoạt động |
| created_at | DATETIME | Ngày tạo |

### slot_configs
Lưu template cấu hình slot khám cho admin.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(120) | Tên cấu hình |
| working_start | VARCHAR(10) | Giờ bắt đầu |
| working_end | VARCHAR(10) | Giờ kết thúc |
| slot_duration_minutes | INT | Độ dài mỗi slot |
| active | BIT | Trạng thái hoạt động |
| notes | TEXT | Ghi chú |
| created_at | DATETIME | Ngày tạo |

### notifications
Lưu thông báo hệ thống.

| Column | Type | Description |
|------|------|-------------|
| id | BIGINT | Primary key |
| title | VARCHAR(180) | Tiêu đề |
| message | TEXT | Nội dung |
| target_role | VARCHAR(20) | Role nhận thông báo |
| active | BIT | Trạng thái hoạt động |
| created_at | DATETIME | Ngày tạo |

## 4. Main Relationships
- `users` 1-1 `patients`
- `users` 1-1 `doctors`
- `patients` N-1 `users`
- `doctors` N-1 `users`
- `appointments` N-1 `patients`
- `appointments` N-1 `doctors`
- `medical_records` 1-1 hoặc 1-N logic theo `appointments`
- `prescriptions` N-1 `medical_records`
- `test_requests` N-1 `medical_records`
- `test_results` N-1 `medical_records`
- `reviews` N-1 `patients`
- `reviews` N-1 `doctors`

## 5. Notes
- Một số bảng catalog và support (`specialties`, `slot_configs`, `notifications`, `refresh_tokens`) được thêm để đáp ứng luồng `ADMIN` và `JWT auth`.
- Tài liệu này phản ánh implementation hiện tại của source code, không còn bị giới hạn ở scope rubric ban đầu `6–10 bảng`.
