# Requirements

## 1. Tên đề tài

Hệ Thống Quản Lý Phòng Khám (Clinic Management)

## 2. Bối cảnh

Trong mô hình phòng khám truyền thống, bệnh nhân thường phải đến trực tiếp để lấy số, chờ đợi lâu và khó biết trước bác sĩ nào còn lịch trống. Việc quản lý hồ sơ bệnh án, đơn thuốc và kết quả xét nghiệm bằng giấy cũng dễ thất lạc, khó tra cứu và gây chậm trễ cho cả bệnh nhân lẫn bác sĩ.

## 3. Mục tiêu hệ thống

Xây dựng một hệ thống web giúp số hóa quy trình khám chữa bệnh tại phòng khám:

- hỗ trợ bệnh nhân đặt lịch khám online, thanh toán đặt cọc, xem lịch sử khám, đơn thuốc và kết quả xét nghiệm
- hỗ trợ bác sĩ xem lịch khám, ghi chẩn đoán, kê đơn thuốc và yêu cầu xét nghiệm
- hỗ trợ quản trị viên điều hành và cấu hình hệ thống

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

## 5. Phạm vi chức năng

## 5.1 Authentication và Authorization

- Đăng ký tài khoản
- Đăng nhập bằng username hoặc email
- Cấp access token và refresh token
- Phân quyền theo role `PATIENT`, `DOCTOR`, `ADMIN`
- Bảo vệ endpoint bằng Spring Security + JWT

## 5.2 Quản lý lịch khám

- Bệnh nhân xem danh sách bác sĩ
- Bệnh nhân xem slot trống theo ngày
- Bệnh nhân đặt lịch khám
- Bệnh nhân xem trạng thái lịch hẹn và trạng thái thanh toán
- Bác sĩ xem lịch khám trong ngày

## 5.3 Hồ sơ khám bệnh

- Bác sĩ tạo hồ sơ bệnh án từ lịch hẹn
- Bác sĩ lưu chẩn đoán, triệu chứng, ghi chú và ngày tái khám
- Bệnh nhân xem lịch sử khám bệnh
- Bác sĩ xem lịch sử bệnh nhân

## 5.4 Đơn thuốc và xét nghiệm

- Bác sĩ kê đơn thuốc từ hồ sơ bệnh án
- Bác sĩ tạo yêu cầu xét nghiệm
- Bệnh nhân xem đơn thuốc
- Bệnh nhân xem kết quả xét nghiệm

## 5.5 Thanh toán và hóa đơn

- Bệnh nhân thanh toán đặt cọc bằng MoMo sandbox
- Có phương án thanh toán mô phỏng để phục vụ demo fallback
- Hệ thống lưu giao dịch thanh toán
- Hệ thống sinh hóa đơn cho lịch hẹn đã thanh toán
- Bệnh nhân có thể xem và in hóa đơn

## 5.6 Đánh giá và thông báo

- Bệnh nhân đánh giá bác sĩ sau khi khám
- Admin quản lý thông báo hệ thống
- Hệ thống hiển thị thông báo đang active theo đúng role trên header frontend

## 6. Yêu cầu phi chức năng

- Giao diện web rõ ràng, dễ sử dụng cho cả 3 vai trò
- Hỗ trợ phân quyền và kiểm soát truy cập theo role
- Dữ liệu lưu trữ trong MySQL
- API thiết kế theo RESTful style
- Hệ thống có thể mở rộng thêm tính năng và tích hợp bên thứ ba
- Có dữ liệu seed để demo và kiểm thử nhanh

## 7. Công nghệ áp dụng

- Backend: Spring Boot
- Frontend: ReactJS
- Database: MySQL
- Security: Spring Security + JWT
- Build frontend: Vite
- Payment demo: MoMo sandbox

## 8. Notes

Source code hiện tại đã hoàn thiện đủ 3 role và 18 tính năng nghiệp vụ chính theo bài toán:

- 6 tính năng cho `PATIENT`
- 6 tính năng cho `DOCTOR`
- 6 tính năng cho `ADMIN`

Ngoài ra, implementation hiện tại còn mở rộng thêm một số thành phần hỗ trợ vận hành và demo:

- thanh toán MoMo sandbox
- thanh toán mô phỏng fallback
- hóa đơn điện tử
- dữ liệu seed mở rộng cho cả 3 vai trò
