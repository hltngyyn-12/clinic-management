# Clinic Management System - API Documentation

## 1. Base URL

```text
http://localhost:8080
```

## 2. Authentication

Hệ thống dùng JWT Bearer Token cho hầu hết business APIs.

Header chuẩn:

```text
Authorization: Bearer <access_token>
```

Các endpoint public hiện tại:

- `GET /`
- `GET /api/test`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/payments/momo/return`
- `POST /api/payments/momo/ipn`

## 3. Response Format

Nhiều API business trả về cấu trúc chung:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Ngoài ra, một số API auth hoặc callback có thể trả object riêng theo từng flow.

## 4. Authentication APIs

### POST /api/auth/register

Đăng ký tài khoản mới.

Request mẫu:

```json
{
  "username": "patient01",
  "email": "patient01@clinic.local",
  "password": "123456",
  "fullName": "Nguyễn Văn A",
  "role": "PATIENT"
}
```

### POST /api/auth/login

Đăng nhập bằng username hoặc email.

Request mẫu:

```json
{
  "usernameOrEmail": "patient.demo.1",
  "password": "patient123"
}
```

Response mẫu:

```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "role": "PATIENT"
}
```

### POST /api/auth/refresh

Làm mới access token từ refresh token.

```json
{
  "refreshToken": "your_refresh_token"
}
```

### GET /api/auth/me

Trả về thông tin tài khoản đang đăng nhập.

## 5. Public Doctor APIs

### GET /api/doctors

Lấy danh sách bác sĩ hiển thị cho trang đặt lịch.

### GET /api/doctors/{id}/slots?date=yyyy-MM-dd

Lấy danh sách slot trống của bác sĩ theo ngày.

### GET /api/doctors/{id}/reviews

Lấy danh sách đánh giá của bác sĩ.

### GET /api/doctors/test

Endpoint kiểm tra đơn giản phục vụ debug.

## 6. Patient APIs

Base path: `/api/patient`

### GET /api/patient/doctors

Lấy danh sách bác sĩ cho patient portal.

### POST /api/patient/appointments

Đặt lịch khám mới.

Request mẫu:

```json
{
  "doctorId": 1,
  "date": "2026-05-01",
  "slotTime": "09:00",
  "reason": "Khám tổng quát"
}
```

### PUT /api/patient/appointments/{appointmentId}/deposit

Thanh toán đặt cọc nội bộ theo flow cũ.

### GET /api/patient/appointments

Lấy danh sách lịch hẹn của patient.

### GET /api/patient/medical-history

Lấy lịch sử khám bệnh.

### GET /api/patient/prescriptions

Lấy danh sách đơn thuốc của bệnh nhân.

### GET /api/patient/test-results

Lấy danh sách kết quả xét nghiệm.

### POST /api/patient/reviews

Gửi đánh giá bác sĩ sau khám.

Request mẫu:

```json
{
  "appointmentId": 1,
  "rating": 5,
  "comment": "Bác sĩ tư vấn rõ ràng, thái độ tốt."
}
```

### GET /api/patient/reviews

Lấy danh sách đánh giá mà bệnh nhân đã gửi.

## 7. Payment APIs

### POST /api/patient/appointments/{appointmentId}/deposit/mock

Thanh toán mô phỏng fallback. Dùng khi cần hoàn tất demo mà không phụ thuộc vào sandbox bên thứ ba.

Kết quả:

- cập nhật `paymentStatus = PAID`
- tạo `payment_transaction`
- sinh `appointment_invoice`

### POST /api/patient/appointments/{appointmentId}/deposit/momo

Tạo giao dịch MoMo sandbox và trả về `payUrl`.

### GET /api/patient/invoices/{appointmentId}

Lấy hóa đơn của một lịch hẹn đã thanh toán.

### GET /api/payments/momo/return

Endpoint redirect từ MoMo về backend sau khi người dùng hoàn tất thanh toán.

### POST /api/payments/momo/ipn

Endpoint callback/IPN từ MoMo sandbox.

## 8. Doctor APIs

Base path: `/api/doctor`

### GET /api/doctor/appointments/today

Lấy lịch khám trong ngày của bác sĩ đang đăng nhập.

### POST /api/doctor/medical-records

Tạo hồ sơ bệnh án từ lịch hẹn.

Request mẫu:

```json
{
  "appointmentId": 1,
  "diagnosis": "Viêm họng cấp",
  "symptoms": "Đau họng, sốt nhẹ, mệt mỏi",
  "notes": "Theo dõi thêm trong 3 ngày",
  "followUpDate": "2026-05-07"
}
```

### POST /api/doctor/prescriptions

Tạo đơn thuốc cho hồ sơ bệnh án.

Request mẫu:

```json
{
  "medicalRecordId": 1,
  "medicineId": 2,
  "medicineName": "Paracetamol 500mg",
  "dosage": "1 viên/lần",
  "frequency": "Ngày 2 lần",
  "duration": "5 ngày",
  "instructions": "Uống sau ăn"
}
```

### POST /api/doctor/test-requests

Tạo yêu cầu xét nghiệm.

Request mẫu:

```json
{
  "medicalRecordId": 1,
  "testName": "Xét nghiệm máu tổng quát"
}
```

### GET /api/doctor/patients/{patientId}/history

Lấy lịch sử bệnh nhân để bác sĩ tham khảo trước hoặc trong khi khám.

### GET /api/doctor/profile

Lấy hồ sơ cá nhân của bác sĩ đang đăng nhập.

### PUT /api/doctor/profile

Cập nhật hồ sơ cá nhân của bác sĩ.

### GET /api/doctor/medicines

Lấy danh mục thuốc để kê đơn.

## 9. Admin APIs

Base path: `/api/admin`

### 9.1 Doctor Management

- `GET /api/admin/doctors`
- `GET /api/admin/doctors/{doctorId}`
- `POST /api/admin/doctors`
- `PUT /api/admin/doctors/{doctorId}`
- `DELETE /api/admin/doctors/{doctorId}`

### 9.2 Specialty Management

- `GET /api/admin/specialties`
- `POST /api/admin/specialties`
- `PUT /api/admin/specialties/{specialtyId}`
- `DELETE /api/admin/specialties/{specialtyId}`

### 9.3 Medicine Management

- `GET /api/admin/medicines`
- `POST /api/admin/medicines`
- `PUT /api/admin/medicines/{medicineId}`
- `DELETE /api/admin/medicines/{medicineId}`

### 9.4 Slot Configuration

- `GET /api/admin/slot-configs`
- `POST /api/admin/slot-configs`
- `PUT /api/admin/slot-configs/{slotConfigId}`
- `DELETE /api/admin/slot-configs/{slotConfigId}`

### 9.5 Revenue Report

- `GET /api/admin/reports/revenue?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd`

### 9.6 Notification Management

- `GET /api/admin/notifications`
- `POST /api/admin/notifications`
- `PUT /api/admin/notifications/{notificationId}`
- `DELETE /api/admin/notifications/{notificationId}`

## 10. Notification Runtime API

### GET /api/notifications/me

Lấy danh sách thông báo đang active cho tài khoản hiện tại.

Logic lọc:

- `targetRole` khớp với role hiện tại
- hoặc `targetRole = ALL`
- `active = true`

Frontend dùng endpoint này để hiển thị dropdown thông báo trên header.

## 11. Legacy / Compatibility APIs

Các endpoint dưới đây vẫn còn trong source, chủ yếu phục vụ tương thích hoặc debug:

- `GET /api/appointments/me`
- `POST /api/medical-records`
- `GET /api/medical-records/{id}`
- `POST /api/prescriptions`
- `GET /api/prescriptions`
- `POST /api/tests`
- `GET /api/tests`

## 12. HTTP Status Codes

| Code | Ý nghĩa |
|------|---------|
| 200 | Thành công |
| 400 | Dữ liệu đầu vào không hợp lệ |
| 401 | Chưa xác thực |
| 403 | Không đủ quyền |
| 404 | Không tìm thấy tài nguyên |
| 500 | Lỗi hệ thống |

## 13. Notes

- Toàn bộ business API trả JSON.
- Frontend chính đang dùng group endpoint `auth`, `patient`, `doctor`, `admin`, `notifications`, `payments`.
- MoMo hiện dùng sandbox với `requestType=payWithATM`.
- Khi demo, có thể dùng `deposit/mock` để bảo đảm quy trình thanh toán luôn hoàn tất nếu sandbox bên thứ ba không ổn định.
