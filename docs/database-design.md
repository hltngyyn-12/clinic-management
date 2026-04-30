# Database Design

## 1. Tổng quan

Hệ thống hiện dùng MySQL với database chính là `clinic_management`.

Schema được Hibernate cập nhật tự động theo source code hiện tại. Tài liệu này mô tả trạng thái bảng dữ liệu đang được ứng dụng sử dụng thực tế, bao gồm cả nhóm bảng hỗ trợ thanh toán, hóa đơn và thông báo hệ thống.

## 2. Danh sách bảng hiện tại

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
15. `payment_transactions`
16. `appointment_invoices`

## 3. Mô tả chi tiết từng bảng

### 3.1 users

Lưu tài khoản đăng nhập cho toàn bộ hệ thống.

| Cột           | Kiểu         | Mô tả                        |
| ------------- | ------------ | ---------------------------- |
| id            | BIGINT       | Khóa chính                   |
| username      | VARCHAR(50)  | Username duy nhất            |
| email         | VARCHAR(100) | Email duy nhất               |
| password_hash | VARCHAR(255) | Mật khẩu đã mã hóa           |
| full_name     | VARCHAR(100) | Họ tên hiển thị              |
| phone         | VARCHAR(20)  | Số điện thoại                |
| role          | ENUM         | `ADMIN`, `DOCTOR`, `PATIENT` |
| created_at    | DATETIME(6)  | Ngày tạo tài khoản           |

### 3.2 patients

Lưu hồ sơ nghiệp vụ của bệnh nhân.

| Cột              | Kiểu         | Mô tả                    |
| ---------------- | ------------ | ------------------------ |
| id               | BIGINT       | Khóa chính               |
| user_id          | BIGINT       | Liên kết 1-1 với `users` |
| date_of_birth    | DATETIME(6)  | Ngày sinh                |
| gender           | VARCHAR(255) | Giới tính                |
| address          | VARCHAR(255) | Địa chỉ                  |
| insurance_number | VARCHAR(255) | Số bảo hiểm y tế         |

### 3.3 doctors

Lưu hồ sơ bác sĩ.

| Cột                   | Kiểu          | Mô tả                            |
| --------------------- | ------------- | -------------------------------- |
| id                    | BIGINT        | Khóa chính                       |
| user_id               | BIGINT        | Liên kết 1-1 với `users`         |
| specialty             | VARCHAR(255)  | Tên chuyên khoa dạng text        |
| specialty_id          | BIGINT        | Liên kết logic đến `specialties` |
| bio                   | VARCHAR(255)  | Mô tả ngắn                       |
| active                | BIT(1)        | Trạng thái hoạt động             |
| consultation_fee      | DECIMAL(38,2) | Phí khám                         |
| degree                | VARCHAR(255)  | Học vị                           |
| experience            | INT           | Trường cũ về số năm kinh nghiệm  |
| experience_years      | INT           | Số năm kinh nghiệm               |
| room_number           | VARCHAR(255)  | Phòng khám                       |
| slot_duration_minutes | INT           | Độ dài slot mặc định             |
| working_start         | VARCHAR(255)  | Giờ bắt đầu                      |
| working_end           | VARCHAR(255)  | Giờ kết thúc                     |

### 3.4 appointments

Lưu lịch khám giữa bệnh nhân và bác sĩ.

| Cột              | Kiểu         | Mô tả                            |
| ---------------- | ------------ | -------------------------------- |
| id               | BIGINT       | Khóa chính                       |
| patient_id       | BIGINT       | FK đến `patients`                |
| doctor_id        | BIGINT       | FK đến `doctors`                 |
| appointment_date | DATE         | Ngày khám                        |
| slot_time        | TIME         | Giờ khám                         |
| status           | VARCHAR(20)  | Trạng thái lịch hẹn              |
| reason           | TEXT         | Lý do khám                       |
| deposit_amount   | DOUBLE       | Tiền đặt cọc                     |
| payment_status   | VARCHAR(255) | `UNPAID`, `PAID`                 |
| review_comment   | TEXT         | Nội dung review gắn với lịch hẹn |
| review_rating    | INT          | Số sao đánh giá                  |
| reviewed         | BIT(1)       | Đã đánh giá hay chưa             |
| created_at       | DATETIME(6)  | Ngày tạo lịch hẹn                |

### 3.5 medical_records

Lưu hồ sơ khám bệnh do bác sĩ tạo.

| Cột            | Kiểu                      | Mô tả                 |
| -------------- | ------------------------- | --------------------- |
| id             | BIGINT                    | Khóa chính            |
| patient_id     | BIGINT                    | FK đến `patients`     |
| doctor_id      | BIGINT                    | FK đến `doctors`      |
| appointment_id | BIGINT                    | FK đến `appointments` |
| diagnosis      | VARCHAR(255)              | Chẩn đoán             |
| notes          | VARCHAR(255)              | Ghi chú điều trị      |
| symptoms       | VARCHAR(255) / TEXT logic | Triệu chứng           |
| follow_up_date | DATE                      | Ngày tái khám         |
| created_at     | DATE                      | Ngày tạo hồ sơ        |

### 3.6 prescriptions

Lưu đơn thuốc của hồ sơ bệnh án.

| Cột               | Kiểu         | Mô tả                          |
| ----------------- | ------------ | ------------------------------ |
| id                | BIGINT       | Khóa chính                     |
| medical_record_id | BIGINT       | FK đến `medical_records`       |
| medicine_id       | BIGINT       | Liên kết logic đến `medicines` |
| medicine_name     | VARCHAR(255) | Tên thuốc text                 |
| dosage            | VARCHAR(255) | Liều dùng                      |
| frequency         | VARCHAR(255) | Tần suất sử dụng               |
| duration          | VARCHAR(255) | Thời gian sử dụng              |
| instructions      | VARCHAR(255) | Hướng dẫn dùng thuốc           |
| created_at        | DATETIME(6)  | Ngày tạo                       |

### 3.7 test_requests

Lưu yêu cầu xét nghiệm do bác sĩ tạo.

| Cột               | Kiểu         | Mô tả                    |
| ----------------- | ------------ | ------------------------ |
| id                | BIGINT       | Khóa chính               |
| medical_record_id | BIGINT       | FK đến `medical_records` |
| test_name         | VARCHAR(255) | Tên xét nghiệm           |
| status            | VARCHAR(255) | Trạng thái yêu cầu       |

### 3.8 test_results

Lưu kết quả xét nghiệm.

| Cột               | Kiểu                      | Mô tả                    |
| ----------------- | ------------------------- | ------------------------ |
| id                | BIGINT                    | Khóa chính               |
| test_request_id   | BIGINT                    | FK đến `test_requests`   |
| medical_record_id | BIGINT                    | FK đến `medical_records` |
| test_name         | VARCHAR(255)              | Tên xét nghiệm           |
| request_note      | VARCHAR(255) / TEXT logic | Ghi chú yêu cầu          |
| result            | VARCHAR(255)              | Kết quả ngắn             |
| result_text       | VARCHAR(255) / TEXT logic | Diễn giải chi tiết       |
| conclusion        | VARCHAR(255)              | Kết luận                 |
| result_date       | DATE                      | Ngày có kết quả          |
| status            | VARCHAR(255)              | Trạng thái               |
| created_at        | DATETIME(6)               | Ngày tạo                 |

### 3.9 reviews

Lưu đánh giá bác sĩ sau khám.

| Cột            | Kiểu        | Mô tả                 |
| -------------- | ----------- | --------------------- |
| id             | BIGINT      | Khóa chính            |
| patient_id     | BIGINT      | FK đến `patients`     |
| doctor_id      | BIGINT      | FK đến `doctors`      |
| appointment_id | BIGINT      | FK đến `appointments` |
| rating         | INT         | Điểm đánh giá         |
| comment        | TEXT        | Nội dung đánh giá     |
| created_at     | DATETIME(6) | Ngày tạo              |

### 3.10 refresh_tokens

Lưu refresh token cho JWT authentication.

| Cột         | Kiểu     | Mô tả               |
| ----------- | -------- | ------------------- |
| id          | BIGINT   | Khóa chính          |
| user_id     | BIGINT   | FK đến `users`      |
| token       | VARCHAR  | Refresh token       |
| expiry_date | DATETIME | Ngày hết hạn        |
| revoked     | BIT(1)   | Đã thu hồi hay chưa |

### 3.11 medicines

Danh mục thuốc do admin quản lý.

| Cột            | Kiểu          | Mô tả              |
| -------------- | ------------- | ------------------ |
| id             | BIGINT        | Khóa chính         |
| name           | VARCHAR(100)  | Tên thuốc          |
| unit           | VARCHAR(255)  | Đơn vị             |
| stock_quantity | INT           | Số lượng tồn       |
| price          | DECIMAL(38,2) | Giá tham khảo      |
| description    | TEXT          | Mô tả              |
| active         | BIT(1)        | Trạng thái sử dụng |
| created_at     | DATETIME(6)   | Ngày tạo           |

### 3.12 specialties

Danh mục chuyên khoa.

| Cột         | Kiểu         | Mô tả              |
| ----------- | ------------ | ------------------ |
| id          | BIGINT       | Khóa chính         |
| name        | VARCHAR(120) | Tên chuyên khoa    |
| description | TEXT         | Mô tả              |
| active      | BIT(1)       | Trạng thái sử dụng |
| created_at  | DATETIME(6)  | Ngày tạo           |

### 3.13 slot_configs

Lưu mẫu cấu hình slot khám cho admin.

| Cột                   | Kiểu         | Mô tả              |
| --------------------- | ------------ | ------------------ |
| id                    | BIGINT       | Khóa chính         |
| name                  | VARCHAR(120) | Tên cấu hình       |
| working_start         | VARCHAR(10)  | Giờ bắt đầu        |
| working_end           | VARCHAR(10)  | Giờ kết thúc       |
| slot_duration_minutes | INT          | Độ dài mỗi slot    |
| active                | BIT(1)       | Trạng thái sử dụng |
| notes                 | TEXT         | Ghi chú            |
| created_at            | DATETIME(6)  | Ngày tạo           |

### 3.14 notifications

Lưu thông báo hệ thống.

| Cột         | Kiểu         | Mô tả               |
| ----------- | ------------ | ------------------- |
| id          | BIGINT       | Khóa chính          |
| title       | VARCHAR(180) | Tiêu đề             |
| message     | TEXT         | Nội dung            |
| target_role | VARCHAR(20)  | Role nhận thông báo |
| active      | BIT(1)       | Trạng thái hiển thị |
| created_at  | DATETIME(6)  | Ngày tạo            |

### 3.15 payment_transactions

Lưu giao dịch thanh toán đặt cọc.

| Cột                     | Kiểu          | Mô tả                            |
| ----------------------- | ------------- | -------------------------------- |
| id                      | BIGINT        | Khóa chính                       |
| appointment_id          | BIGINT        | FK đến `appointments`            |
| patient_id              | BIGINT        | FK đến `patients`                |
| provider                | VARCHAR(20)   | `MOMO`, `MOCK`                   |
| transaction_ref         | VARCHAR(100)  | Mã giao dịch nội bộ              |
| provider_order_id       | VARCHAR(100)  | Mã đơn hàng phía cổng thanh toán |
| provider_transaction_no | VARCHAR(100)  | Mã giao dịch phía nhà cung cấp   |
| amount                  | DOUBLE        | Số tiền giao dịch                |
| status                  | VARCHAR(20)   | Trạng thái giao dịch             |
| response_code           | VARCHAR(20)   | Mã phản hồi từ cổng thanh toán   |
| message                 | VARCHAR(255)  | Mô tả phản hồi                   |
| payment_url             | VARCHAR(1200) | URL thanh toán nếu có            |
| paid_at                 | DATETIME(6)   | Thời điểm thanh toán thành công  |
| created_at              | DATETIME(6)   | Ngày tạo                         |
| updated_at              | DATETIME(6)   | Ngày cập nhật                    |

### 3.16 appointment_invoices

Lưu hóa đơn của lịch hẹn đã thanh toán.

| Cột                    | Kiểu         | Mô tả                                   |
| ---------------------- | ------------ | --------------------------------------- |
| id                     | BIGINT       | Khóa chính                              |
| appointment_id         | BIGINT       | FK đến `appointments`                   |
| payment_transaction_id | BIGINT       | FK đến `payment_transactions`           |
| invoice_number         | VARCHAR(50)  | Số hóa đơn duy nhất                     |
| amount                 | DOUBLE       | Giá trị thanh toán                      |
| doctor_name            | VARCHAR(100) | Tên bác sĩ tại thời điểm lập hóa đơn    |
| patient_name           | VARCHAR(100) | Tên bệnh nhân tại thời điểm lập hóa đơn |
| specialty              | VARCHAR(255) | Chuyên khoa                             |
| payment_method         | VARCHAR(20)  | Phương thức thanh toán                  |
| payment_status         | VARCHAR(20)  | Trạng thái thanh toán                   |
| issued_at              | DATETIME(6)  | Ngày phát hành hóa đơn                  |

## 4. Main Relationships

- `users` 1-1 `patients`
- `users` 1-1 `doctors`
- `patients` 1-N `appointments`
- `doctors` 1-N `appointments`
- `appointments` 1-1 hoặc 1-N logic với `medical_records`
- `medical_records` 1-N `prescriptions`
- `medical_records` 1-N `test_requests`
- `test_requests` 1-1 hoặc 1-N logic với `test_results`
- `appointments` 1-0..1 `reviews`
- `appointments` 1-0..1 `payment_transactions` theo từng lần thanh toán dùng trong demo hiện tại
- `payment_transactions` 1-0..1 `appointment_invoices`

## 5. Notes

- `payment_transactions` và `appointment_invoices` được thêm để hỗ trợ flow thanh toán đặt cọc, hóa đơn và in hóa đơn.
