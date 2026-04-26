# API Documentation

## Base URL
`http://localhost:8080`

## Authentication
Tất cả API nghiệp vụ dùng JWT Bearer Token, trừ:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /`
- `GET /api/test`

Header mẫu:
```http
Authorization: Bearer <jwt-token>
```

## 1. Authentication

### POST /api/auth/register
Đăng ký tài khoản.

Request body:
```json
{
  "username": "patient01",
  "email": "patient01@clinic.local",
  "password": "123456",
  "fullName": "Nguyen Van A",
  "role": "PATIENT"
}
```

### POST /api/auth/login
Đăng nhập bằng `usernameOrEmail` và `password`.

### POST /api/auth/refresh
Lấy access token mới từ refresh token.

### GET /api/auth/me
Lấy thông tin user hiện tại.

## 2. Common / Utility

### GET /
Health check đơn giản.

### GET /api/test
Test endpoint.

### GET /api/doctors
Danh sách bác sĩ cho patient booking.

### GET /api/doctors/{id}/slots?date=yyyy-MM-dd
Lấy slot trống của bác sĩ theo ngày.

### GET /api/doctors/{id}/reviews
Lấy review của bác sĩ.

## 3. Patient APIs
Base path: `/api/patient`

### GET /api/patient/doctors
Lấy danh sách bác sĩ khả dụng cho patient portal.

### POST /api/patient/appointments
Đặt lịch khám.

Request body:
```json
{
  "doctorId": 1,
  "date": "2026-04-30",
  "time": "09:00",
  "reason": "General checkup"
}
```

### PUT /api/patient/appointments/{appointmentId}/deposit
Thanh toán đặt cọc cho appointment.

### GET /api/patient/appointments
Lấy lịch hẹn của patient hiện tại.

### GET /api/patient/medical-history
Lấy lịch sử khám bệnh.

### GET /api/patient/prescriptions
Lấy đơn thuốc của patient hiện tại.

### GET /api/patient/test-results
Lấy kết quả xét nghiệm của patient hiện tại.

### POST /api/patient/reviews
Tạo đánh giá bác sĩ sau khám.

Request body:
```json
{
  "appointmentId": 1,
  "rating": 5,
  "comment": "Doctor explained clearly."
}
```

### GET /api/patient/reviews
Lấy các review patient đã gửi.

## 4. Doctor APIs
Base path: `/api/doctor`

### GET /api/doctor/appointments/today
Lấy lịch khám trong ngày của bác sĩ hiện tại.

### POST /api/doctor/medical-records
Tạo hồ sơ khám bệnh từ một appointment.

Request body:
```json
{
  "appointmentId": 1,
  "diagnosis": "Common cold",
  "symptoms": "Fever, cough",
  "notes": "Patient should rest",
  "followUpDate": "2026-05-03"
}
```

### POST /api/doctor/prescriptions
Tạo đơn thuốc cho medical record.

Request body:
```json
{
  "medicalRecordId": 1,
  "medicineId": 1,
  "medicineName": "Cetirizine 10mg",
  "dosage": "1 tablet",
  "frequency": "2 times/day",
  "duration": "5 days",
  "instructions": "After meals"
}
```

### POST /api/doctor/test-requests
Tạo yêu cầu xét nghiệm cho medical record.

Request body:
```json
{
  "medicalRecordId": 1,
  "testName": "Blood test"
}
```

### GET /api/doctor/patients/{patientId}/history
Xem lịch sử bệnh nhân.

### GET /api/doctor/profile
Lấy hồ sơ bác sĩ hiện tại.

### PUT /api/doctor/profile
Cập nhật hồ sơ bác sĩ hiện tại.

### GET /api/doctor/medicines
Lấy danh sách thuốc để bác sĩ kê đơn.

## 5. Admin APIs
Base path: `/api/admin`

### Doctor Management
- `GET /api/admin/doctors`
- `GET /api/admin/doctors/{doctorId}`
- `POST /api/admin/doctors`
- `PUT /api/admin/doctors/{doctorId}`
- `DELETE /api/admin/doctors/{doctorId}`

### Specialty Management
- `GET /api/admin/specialties`
- `POST /api/admin/specialties`
- `PUT /api/admin/specialties/{specialtyId}`
- `DELETE /api/admin/specialties/{specialtyId}`

### Medicine Management
- `GET /api/admin/medicines`
- `POST /api/admin/medicines`
- `PUT /api/admin/medicines/{medicineId}`
- `DELETE /api/admin/medicines/{medicineId}`

### Slot Configuration
- `GET /api/admin/slot-configs`
- `POST /api/admin/slot-configs`
- `PUT /api/admin/slot-configs/{slotConfigId}`
- `DELETE /api/admin/slot-configs/{slotConfigId}`

### Revenue Report
### GET /api/admin/reports/revenue?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd
Lấy báo cáo doanh thu theo khoảng ngày.

### Notification Management
- `GET /api/admin/notifications`
- `POST /api/admin/notifications`
- `PUT /api/admin/notifications/{notificationId}`
- `DELETE /api/admin/notifications/{notificationId}`

## 6. Legacy / Supporting Endpoints
Project hiện vẫn còn một số endpoint hỗ trợ hoặc cũ:

- `GET /api/appointments/me`
- `POST /api/medical-records`
- `GET /api/medical-records/{id}`
- `POST /api/prescriptions`
- `GET /api/prescriptions`
- `POST /api/tests`
- `GET /api/tests`
- `GET /api/doctors/test`

Các endpoint này vẫn tồn tại trong source hiện tại, nhưng UI chính đang ưu tiên dùng các portal API theo role: `/api/patient`, `/api/doctor`, `/api/admin`.

## 7. Response Format
Đa số endpoint trả theo wrapper:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```
