# 📊 Báo cáo Tuần 7

**Tuần:** 7  
**Từ:** 13/04/2026 - 19/04/2026  
**Đề tài:** Hệ thống Quản Lý Phòng Khám  
**Nhóm trưởng:** Trần Văn Trí Hửu - 2251010038  

---

## 1. Công việc đã hoàn thành

| Thành viên | MSSV | Công việc | Link Commit/PR |
|------------|------|-----------|----------------|
| Hồ Lê Thảo Nguyên | 2251010065 | Hoàn thiện frontend medical record: xây dựng UI chi tiết hồ sơ khám; hiển thị đầy đủ prescription và test result; xử lý phân quyền hiển thị theo role (doctor/patient); cải thiện UX/UI và xử lý trạng thái loading/error/empty | [link] |
| Nguyễn Cẩm Hiền | 2251010029 | Mở rộng backend: xây dựng API update/delete cho Prescription và Test; bổ sung API TestResult; tối ưu query và xử lý quan hệ giữa MedicalRecord - Prescription - Test; cải thiện exception handling và validation | [link] |
| Trần Văn Trí Hửu | 2251010038 | Chuẩn hóa backend & tích hợp hệ thống: xây dựng DTO response cho MedicalRecord; mapping entity → DTO; chuẩn hóa API response bằng ApiResponse; viết Global Exception Handler; kiểm thử tích hợp (integration test); hỗ trợ frontend tích hợp API; xây dựng tài liệu API (api-docs.md) | [link] |

---

## 2. Tiến độ tổng thể

| Hạng mục | Trạng thái | % |
|----------|------------|---|
| Authentication & JWT | Done | 100% |
| Authorization (RBAC) | Done | 100% |
| Booking module | Done | 100% |
| Medical record backend | Done | 100% |
| Prescription & Test API | Done | 100% |
| DTO & Mapping | Done | 100% |
| Standard API Response | Done | 100% |
| Global Exception Handling | Done | 100% |
| Medical record frontend | Done | 100% |

**Tổng tiến độ:** **100%**

---

## 3. Kế hoạch tuần tới (Tuần 8)

| Thành viên | Công việc dự kiến |
|------------|-------------------|
| Hồ Lê Thảo Nguyên | Hoàn thiện UI tổng thể; tối ưu trải nghiệm người dùng; bổ sung validate phía frontend; chuẩn bị demo |
| Nguyễn Cẩm Hiền | Tối ưu hiệu năng backend; rà soát query; bổ sung test case; cải thiện bảo mật và validation |
| Trần Văn Trí Hửu | Hoàn thiện tài liệu hệ thống (API docs, README);  kiểm thử toàn hệ thống; chuẩn bị demo và slide |

---

## 4. Khó khăn / Cần hỗ trợ

- Mapping dữ liệu giữa nhiều entity phức tạp (MedicalRecord - Prescription - TestResult)  
- Xử lý lazy loading và tránh trả entity trực tiếp trong API  
- Đồng bộ format response giữa backend và frontend  
- Cần đảm bảo phân quyền (RBAC) chính xác cho từng role  

---

**Ngày nộp:** 19/04/2026  
**Xác nhận của Nhóm trưởng:** Trần Văn Trí Hửu  