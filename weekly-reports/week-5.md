# Báo cáo Tuần 5

**Tuần:** 5
**Từ:** [30/03/2026] - [05/04/2026]  
**Đề tài:** Hệ thống Quản Lý Phòng Khám  
**Nhóm trưởng:** [Trần Văn Trí Hửu] - [2251010038]

---

## 1. Công việc đã hoàn thành

| Thành viên | MSSV | Công việc | Link Commit/PR |
|------------|------|-----------|----------------|
| Hồ Lê Thảo Nguyên | [2251010065] | Hoàn thiện xử lý JWT nâng cao: xử lý tự động logout khi token hết hạn (401), refine JwtAuthenticationFilter, đảm bảo các API có phân quyền hoạt động ổn định | [link] |
| Nguyễn Cẩm Hiền | [2251010029] | Hoàn thiện UI hệ thống: cải thiện giao diện login/register, redesign homepage theo hướng landing page hiện đại, xây dựng giao diện danh sách bác sĩ, lịch sử đặt khám và điều hướng đến module medical record | [link] |
| Trần Văn Trí Hửu | [2251010038] | Mở rộng backend module khám bệnh: thiết kế và triển khai các entity gồm MedicalRecord, Prescription, TestRequest, TestResult; xây dựng MedicalRecordService và MedicalRecordController; triển khai API tạo hồ sơ khám (doctor role); validate dữ liệu, tích hợp phân quyền với Spring Security và test API bằng Postman  | [link] |

---

## 2. Tiến độ tổng thể

| Hạng mục | Trạng thái | % |
|----------|------------|---|
| Authentication & JWT | Done | 100% |
| Authorization (RBAC) | Done | 100% |
| Booking module (backend + frontend) | Done | 100% |
| Medical record backend | Done | 100%|
| Prescription & Test module (entity + repository) | Done | 100% |
| UI hệ thống (auth + homepage + booking + doctor list) | Done | 100% |
| API integration (auth + booking) | Done | 100% |

**Tổng tiến độ:**85%

---

## 3. Kế hoạch tuần tới

| Thành viên | Công việc dự kiến |
|------------|-------------------|
| Hồ Lê Thảo Nguyên | Hoàn thiện security nâng cao: phân quyền chi tiết cho medical record (doctor/patient), nghiên cứu và triển khai refresh token |
| Nguyễn Cẩm Hiền | Xây dựng UI medical record (hiển thị hồ sơ khám, đơn thuốc, kết quả xét nghiệm), tích hợp API backend |
| Trần Văn Trí Hửu | Hoàn thiện backend cho prescription và test (API create/list), chuẩn hóa DTO thay cho Map, cải thiện validate và chuẩn hóa response API |

---

## 4. Khó khăn / Cần hỗ trợ

- Module medical record có nhiều quan hệ phức tạp (appointment ↔ patient ↔ doctor) cần kiểm soát chặt chẽ
- Chưa hoàn thiện đầy đủ API cho prescription và test (mới ở mức entity + repository + một phần logic)
- Cần chuẩn hóa DTO để thay thế Map nhằm tăng tính an toàn và dễ validate
- Cần đồng bộ giữa backend API mới và frontend UI medical record

---

**Ngày nộp:** [05/04/2026]  
**Xác nhận của Nhóm trưởng:** [Trần Văn Trí Hửu]