# Báo cáo Tuần 3

**Tuần:** 3
**Từ:** [16/03/2026] - [22/03/2026]  
**Đề tài:** Hệ thống Quản Lý Phòng Khám  
**Nhóm trưởng:** [Trần Văn Trí Hửu] - [2251010038]

---

## 1. Công việc đã hoàn thành

| Thành viên | MSSV | Công việc | Link Commit/PR |
|------------|------|-----------|----------------|
| Hồ Lê Thảo Nguyên | [2251010065] | Hoàn thiện phân quyền cơ bản, cấu hình security (Spring Security), hỗ trợ tích hợp module người dùng với hệ thống | [link] |
| Nguyễn Cẩm Hiền | [2251010029] | Hoàn thiện UI authentication, xử lý điều hướng sau login theo role, gọi API /api/auth/me, lưu thông tin user vào state, chuẩn bị UI module patient và booking| [link] |
| Trần Văn Trí Hửu | [2251010038] | Mở rộng database schema cho doctor/patient/appointment, hoàn thiện migration SQL, đồng bộ quan hệ giữa users và doctor/patient, cập nhật database-design.md, hỗ trợ tích hợp backend module appointment| [link] |

---

## 2. Tiến độ tổng thể

| Hạng mục                                     | Trạng thái | %    |
| -------------------------------------------- | ---------- | ---- |
| Authentication                               | Done       | 100% |
| Authorization (Role-based)                   | Done       | 100% |
| Database schema (doctor/patient/appointment) | Done       | 100% |
| Booking module backend                       | Done       | 100% |
| Booking UI (frontend)                        | Done       | 100% |
| API integration (auth + user)                | Done       | 100% |

**Tổng tiến độ:** 100%

---

## 3. Kế hoạch tuần tới

| Thành viên | Công việc dự kiến |
|------------|-------------------|
| Hồ Lê Thảo Nguyên | Hoàn thiện JWT authentication, refine security config, kiểm soát quyền truy cập API booking             |
| Nguyễn Cẩm Hiền   | Hoàn thiện UI booking (chọn doctor, slot), hiển thị danh sách lịch đã đặt, cải thiện UX                 |
| Trần Văn Trí Hửu  | Hoàn thiện API appointment (create/list/cancel), tối ưu query, validate dữ liệu và xử lý business logic |


---

## 4. Khó khăn / Cần hỗ trợ

- Chưa thống nhất hoàn toàn flow booking giữa frontend và backend
- Cần chuẩn hóa format dữ liệu trả về cho doctor/slot/appointment
- Một số quan hệ database phức tạp (user ↔ doctor/patient) cần xử lý thêm
- Chưa tối ưu validation và xử lý lỗi cho booking

---

**Ngày nộp:** [22/03/2026]  
**Xác nhận của Nhóm trưởng:** [Trần Văn Trí Hửu]