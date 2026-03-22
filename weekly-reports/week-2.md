# Báo cáo Tuần 2

**Tuần:** 2  
**Từ:** [09/03/2026] - [15/03/2026]  
**Đề tài:** Hệ thống Quản Lý Phòng Khám  
**Nhóm trưởng:** [Trần Văn Trí Hửu] - [2251010038]

---

## 1. Công việc đã hoàn thành

| Thành viên | MSSV | Công việc | Link Commit/PR |
|------------|------|-----------|----------------|
| Hồ Lê Thảo Nguyên | [2251010065] | Hoàn thành authentication backend: tạo Role, User entity, UserRepository, Auth DTO, AuthService, AuthController; test API register/login bằng Postman | [link] |
| Nguyễn Cẩm Hiền | [2251010029] | Hoàn thành login/register frontend: tạo LoginPage, RegisterPage, kết nối API auth với backend, xử lý form cơ bản | [link] |
| Trần Văn Trí Hửu | [2251010038] | Hoàn thành database schema và migrations: cập nhật init.sql, đồng bộ bảng users với backend auth, rà soát database docs và api docs | [link] |

---

## 2. Tiến độ tổng thể

| Hạng mục | Trạng thái | % |
|----------|------------|---|
| Phân tích yêu cầu | Done | 100% |
| Setup repository | Done | 100% |
| Setup backend | Done | 100% |
| Setup frontend | Done | 100% |
| Database schema | Done | 100% |
| Authentication backend | Done | 100% |
| Login/Register frontend | Done | 100% |
| API integration auth | Đang làm | 100% |

**Tổng tiến độ:** 100%

---

## 3. Kế hoạch tuần tới

| Thành viên | Công việc dự kiến |
|------------|-------------------|
| Hồ Lê Thảo Nguyên | Hoàn thiện phân quyền cơ bản, chuẩn hóa security config, hỗ trợ tích hợp module người dùng |
| Nguyễn Cẩm Hiền | Hoàn thiện UI auth, xử lý điều hướng sau login, chuẩn bị giao diện module patient |
| Trần Văn Trí Hửu | Mở rộng schema cho doctor/patient/appointment, hoàn thiện migration và hỗ trợ tích hợp backend |

---

## 4. Khó khăn / Cần hỗ trợ

- Cần thống nhất format request/response giữa backend auth và frontend auth
- Cần đồng bộ chặt chẽ giữa bảng users trong migration và User entity trong backend
- Phân quyền hiện mới ở mức cơ bản, chưa triển khai JWT hoàn chỉnh

---

**Ngày nộp:** [15/03/2026]  
**Xác nhận của Nhóm trưởng:** [Trần Văn Trí Hửu]