# Clinic Management System

## Mô tả
Clinic Management System là hệ thống quản lý phòng khám với 3 vai trò chính: `PATIENT`, `DOCTOR`, `ADMIN`.

- `PATIENT` có thể đặt lịch khám online, thanh toán đặt cọc, xem lịch sử khám, xem đơn thuốc, xem kết quả xét nghiệm và đánh giá bác sĩ.
- `DOCTOR` có thể xem lịch khám trong ngày, khám bệnh và ghi chẩn đoán, kê đơn thuốc, yêu cầu xét nghiệm, xem lịch sử bệnh nhân và quản lý hồ sơ cá nhân.
- `ADMIN` có thể quản lý bác sĩ, danh mục chuyên khoa, danh mục thuốc, cấu hình slot khám, báo cáo doanh thu và quản lý thông báo.

## Thành viên nhóm
| MSSV | Họ tên | Vai trò |
|------|--------|---------|
| TBD | TBD | Backend / Frontend / Database |
| TBD | TBD | Backend / Frontend / Database |
| TBD | TBD | Backend / Frontend / Database |

## Công nghệ sử dụng
- Backend: Spring Boot 4, Java 25
- Frontend: ReactJS + Vite
- Database: MySQL
- Security: Spring Security + JWT

## Cài đặt và chạy

### Yêu cầu
- Java 17+  
  Thực tế project đang dùng `Java 25` trong `backend/pom.xml`
- Node.js 18+
- MySQL 8+

### Cấu hình mặc định
- Database name: `clinic_management`
- Backend port: `8080`
- Frontend port: `5173`

Theo [application.properties](/d:/clinic-management/backend/src/main/resources/application.properties:1):
- MySQL username: `root`
- MySQL password: `123456`

### Chạy Backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### Chạy Frontend
```powershell
cd frontend
npm install
npm run dev
```

### Truy cập
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`

## Demo Seed

Để có dữ liệu demo nhanh cho cả 3 role:

1. Chạy backend một lần để Hibernate tạo schema hiện tại.
2. Import file [patient-demo-seed.sql](/d:/clinic-management/database/seeds/patient-demo-seed.sql:1) vào database `clinic_management`.
3. Đăng nhập bằng các tài khoản demo:

- `patient.demo.1 / patient123`
- `patient.demo.2 / patient123`
- `doctor.demo.1 / doctor123`
- `doctor.demo.2 / doctor123`
- `admin.demo.1 / doctor123`

Seed hiện có:
- demo doctors
- demo patients
- demo admin
- appointments
- medical records
- prescriptions
- test requests
- test results
- reviews
- specialties
- slot configs
- notifications

## Tính năng chính

### Patient
- Đặt lịch khám online, chọn bác sĩ, ngày, giờ
- Thanh toán đặt cọc
- Xem lịch sử khám bệnh
- Xem đơn thuốc
- Xem kết quả xét nghiệm
- Đánh giá bác sĩ

### Doctor
- Xem lịch khám trong ngày
- Khám bệnh, ghi chẩn đoán
- Kê đơn thuốc
- Yêu cầu xét nghiệm
- Xem lịch sử bệnh nhân
- Quản lý hồ sơ cá nhân

### Admin
- Quản lý bác sĩ CRUD
- Quản lý danh mục chuyên khoa CRUD
- Quản lý danh mục thuốc CRUD
- Cấu hình slot khám
- Báo cáo doanh thu
- Quản lý thông báo

## Demo
- Có thể bổ sung link video demo hoặc screenshots tại đây.

## Tài liệu
- [Phân tích yêu cầu](docs/requirements.md)
- [Database Design](docs/database-design.md)
- [API Documentation](docs/api-docs.md)
