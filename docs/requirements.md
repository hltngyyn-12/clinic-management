# Requirements

## 1. Tên đề tài
Hệ Thống Quản Lý Phòng Khám (Clinic Management)

## 2. Bối cảnh
- Bệnh nhân phải chờ đợi lâu khi đến phòng khám.
- Khó biết bác sĩ nào còn lịch trống.
- Hồ sơ bệnh án có nguy cơ thất lạc khi quản lý thủ công.

## 3. Mục tiêu hệ thống
Xây dựng hệ thống web giúp:
- bệnh nhân đặt lịch khám online
- bác sĩ xử lý quy trình khám bệnh số hóa
- quản trị viên quản lý vận hành phòng khám

## 4. Vai trò người dùng

### PATIENT
- Đăng ký, đăng nhập
- Đặt lịch khám online theo bác sĩ, ngày và giờ
- Thanh toán đặt cọc
- Xem lịch sử khám bệnh
- Xem đơn thuốc điện tử
- Xem kết quả xét nghiệm online
- Đánh giá bác sĩ

### DOCTOR
- Xem lịch khám trong ngày
- Khám bệnh và ghi chẩn đoán
- Kê đơn thuốc
- Yêu cầu xét nghiệm
- Xem lịch sử bệnh nhân
- Quản lý hồ sơ cá nhân

### ADMIN
- Quản lý bác sĩ CRUD
- Quản lý danh mục chuyên khoa CRUD
- Quản lý danh mục thuốc CRUD
- Cấu hình slot khám
- Xem báo cáo doanh thu
- Quản lý thông báo

## 5. Yêu cầu chức năng

### 5.1 Authentication và Authorization
- Đăng ký tài khoản
- Đăng nhập bằng username/email và password
- Phân quyền theo role `PATIENT`, `DOCTOR`, `ADMIN`
- JWT-based authentication

### 5.2 Quản lý lịch khám
- Bệnh nhân xem bác sĩ và slot trống
- Bệnh nhân đặt lịch khám
- Bệnh nhân xem trạng thái lịch hẹn
- Bác sĩ xem lịch khám trong ngày

### 5.3 Quản lý hồ sơ khám bệnh
- Bác sĩ tạo medical record từ lịch khám
- Bệnh nhân xem lịch sử khám bệnh
- Bác sĩ xem lịch sử bệnh nhân

### 5.4 Quản lý đơn thuốc và xét nghiệm
- Bác sĩ kê đơn thuốc từ medical record
- Bác sĩ tạo yêu cầu xét nghiệm
- Bệnh nhân xem đơn thuốc
- Bệnh nhân xem kết quả xét nghiệm

### 5.5 Quản trị hệ thống
- CRUD doctor
- CRUD specialty
- CRUD medicine
- CRUD slot config
- Revenue report
- Notification management

## 6. Yêu cầu phi chức năng
- Giao diện web dễ sử dụng
- Role-based access control
- Dữ liệu lưu trong MySQL
- API RESTful
- Code có thể mở rộng và bảo trì

## 7. Công nghệ áp dụng
- Backend: Spring Boot
- Frontend: ReactJS
- Database: MySQL
- Security: Spring Security + JWT

## 8. Ghi chú phạm vi hiện tại
Source code hiện tại đã hoàn thiện đủ 3 role và 18 tính năng chính theo bài toán nghiệp vụ.

Lưu ý:
- số lượng bảng thực tế và số lượng endpoints hiện tại đã mở rộng hơn mức rubric tối thiểu
- documentation này phản ánh implementation hiện tại của source code
