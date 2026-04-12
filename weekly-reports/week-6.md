# Báo cáo Tuần 6

**Tuần:** 6  
**Từ:** [06/04/2026] - [12/04/2026]  
**Đề tài:** Hệ thống Quản Lý Phòng Khám  
**Nhóm trưởng:** [Trần Văn Trí Hửu] - [2251010038]

---

## 1. Công việc đã hoàn thành

| Thành viên | MSSV | Công việc | Link Commit/PR |
|------------|------|-----------|----------------|
| Hồ Lê Thảo Nguyên | [2251010065] | Phát triển frontend medical record: xây dựng UI hiển thị hồ sơ khám, danh sách đơn thuốc (prescription), danh sách xét nghiệm (test); tích hợp API backend (create/list), cải thiện trải nghiệm người dùng và xử lý trạng thái loading/error | [link] |
| Nguyễn Cẩm Hiền | [2251010029] | Hoàn thiện backend prescription & test: xây dựng API create/list cho Prescription và TestRequest; chuẩn hóa DTO thay thế Map; thêm validation (@Valid, @NotNull); chuẩn hóa response API bằng ApiResponse; đảm bảo logic service và repository hoạt động ổn định | [link] |
| Trần Văn Trí Hửu | [2251010038] | Hỗ trợ frontend & backend: review và refactor code; tích hợp API giữa frontend và backend; fix bug liên quan đến validate và response; tối ưu cấu trúc project; hỗ trợ test API bằng Postman và debug lỗi phát sinh | [link] |

---

## 2. Tiến độ tổng thể

| Hạng mục | Trạng thái | % |
|----------|------------|---|
| Authentication & JWT | Done | 100% |
| Authorization (RBAC) | Done | 100% |
| Booking module | Done | 100% |
| Medical record backend | Done | 100% |
| Prescription & Test API | Done | 100% |
| DTO & Validation | Done | 100% |
| Standard API Response | Done | 100% |
| Medical record frontend | In Progress | 100% |

**Tổng tiến độ:** 100%

---

## 3. Kế hoạch tuần tới (Tuần 7)

| Thành viên | Công việc dự kiến |
|------------|-------------------|
| Hồ Lê Thảo Nguyên | Hoàn thiện frontend: UI chi tiết medical record, hiển thị đầy đủ prescription và test result; tối ưu UX/UI; thêm xử lý phân quyền hiển thị theo role (doctor/patient) |
| Nguyễn Cẩm Hiền | Mở rộng backend: API update/delete cho prescription và test; bổ sung API test result; tối ưu query và xử lý quan hệ dữ liệu; cải thiện exception handling |
| Trần Văn Trí Hửu | Hỗ trợ cả frontend & backend: viết global exception handler chuẩn; mapping entity → DTO response; kiểm thử toàn hệ thống (integration test); chuẩn bị tài liệu API (api-docs.md) |

---

## 4. Khó khăn / Cần hỗ trợ

- Đồng bộ dữ liệu giữa nhiều entity (medical record, prescription, test) khá phức tạp
- Frontend cần xử lý nhiều trạng thái (loading, error, empty data)
- Chưa có mapping chuẩn giữa entity và DTO response
- Cần cải thiện exception handling để trả lỗi rõ ràng hơn cho frontend

---

**Ngày nộp:** [12/04/2026]  
**Xác nhận của Nhóm trưởng:** [Trần Văn Trí Hửu]