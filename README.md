# Clinic Management System

## Mô tả

Clinic Management System là hệ thống quản lý phòng khám xây dựng theo mô hình 3 vai trò chính: `PATIENT`, `DOCTOR`, `ADMIN`.

- `PATIENT` có thể đăng ký tài khoản, đặt lịch khám online, thanh toán đặt cọc, xem lịch sử khám, xem đơn thuốc, xem kết quả xét nghiệm và đánh giá bác sĩ.
- `DOCTOR` có thể xem lịch khám trong ngày, khám bệnh và ghi chẩn đoán, kê đơn thuốc, yêu cầu xét nghiệm, xem lịch sử bệnh nhân và quản lý hồ sơ cá nhân.
- `ADMIN` có thể quản lý bác sĩ, danh mục chuyên khoa, danh mục thuốc, cấu hình slot khám, báo cáo doanh thu và quản lý thông báo.

## Thành viên nhóm

| MSSV       | Họ tên            | Vai trò                       |
| ---------- | ----------------- | ----------------------------- |
| 2251010038 | Trần Văn Trí Hữu  | Backend / Frontend / Database |
| 2251010029 | Nguyễn Cẩm Hiền   | Backend / Frontend / Database |
| 2251010065 | Hồ Lê Thảo Nguyên | Backend / Frontend / Database |

## Công nghệ sử dụng

- Backend: Spring Boot 4, Java 25
- Frontend: React 19 + Vite
- Database: MySQL
- Security: Spring Security + JWT
- API Client: Axios
- Payment: MoMo sandbox + mock payment fallback

## Cài đặt và chạy

### Yêu cầu

- Java 17+
- Node.js 18+
- MySQL 8+

### Cấu hình mặc định

- Database: `clinic_management`
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`
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

1. Tạo database `clinic_management`.
2. Chạy backend một lần để Hibernate tạo schema hiện tại.
3. Import file [patient-demo-seed.sql](/d:/clinic-management/database/seeds/patient-demo-seed.sql:1) vào database `clinic_management`.
4. Đăng nhập bằng các tài khoản demo:

- `patient.demo.1 / patient123`
- `patient.demo.2 / patient123`
- `patient.demo.3 / patient123`
- `doctor.demo.1 / doctor123`
- `doctor.demo.2 / doctor123`
- `doctor.demo.3 / doctor123`
- `admin.demo.1 / doctor123`

Seed hiện có:

- bác sĩ, bệnh nhân, quản trị viên
- lịch hẹn quá khứ, hiện tại và tương lai
- hồ sơ bệnh án, đơn thuốc, xét nghiệm, đánh giá
- chuyên khoa, thuốc, cấu hình slot
- thông báo hệ thống
- giao dịch thanh toán và hóa đơn

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

## Quy trình demo nhanh

### Demo Patient

1. Đăng nhập `patient.demo.1`
2. Vào `Đặt lịch khám` để tạo lịch mới
3. Vào `Lịch hẹn` để thanh toán đặt cọc
4. Xem `Lịch sử khám`, `Đơn thuốc`, `Xét nghiệm`
5. Gửi `Đánh giá bác sĩ`

### Demo Doctor

1. Đăng nhập `doctor.demo.1`
2. Vào `Lịch làm việc`
3. Chọn lịch hẹn hôm nay
4. Tạo hồ sơ bệnh án
5. Kê đơn thuốc và yêu cầu xét nghiệm
6. Cập nhật `Hồ sơ bác sĩ`

### Demo Admin

1. Đăng nhập `admin.demo.1`
2. Quản lý `Bác sĩ`
3. Quản lý `Chuyên khoa` và `Thuốc`
4. Cấu hình `Slot khám`
5. Xem `Báo cáo doanh thu`
6. Tạo `Thông báo hệ thống`

## Demo

- [Screenshots demo](docs/screenshots)

## Tài liệu

- [Phân tích yêu cầu](docs/requirements.md)
- [Database Design](docs/database-design.md)
- [API documentation](docs/api-docs.md)
