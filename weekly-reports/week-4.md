# Báo cáo Tuần 4

**Tuần:** 4  
**Từ:** [23/03/2026] - [29/03/2026]  
**Đề tài:** Hệ thống Quản Lý Phòng Khám  
**Nhóm trưởng:** [Trần Văn Trí Hửu] - [2251010038]

---

## 1. Công việc đã hoàn thành

| Thành viên | MSSV | Công việc | Link Commit/PR |
|------------|------|-----------|----------------|
| Hồ Lê Thảo Nguyên | [2251010065] | Hoàn thiện JWT authentication: xây dựng JwtService, JwtAuthenticationFilter, refine SecurityConfig theo cơ chế stateless, cập nhật login trả access token, giữ API /api/auth/me hoạt động với Bearer token, kiểm soát quyền truy cập API booking theo role | [link] |
| Nguyễn Cẩm Hiền | [2251010029] | Hoàn thiện UI booking: giao diện chọn doctor, chọn slot, hiển thị danh sách lịch đã đặt, gắn token vào request frontend, cải thiện trải nghiệm người dùng | [link] |
| Trần Văn Trí Hửu | [2251010038] | Hoàn thiện API appointment: create/list/cancel, tối ưu query, validate dữ liệu và xử lý business logic booking, hỗ trợ tích hợp backend với security và role access | [link] |

---

## 2. Tiến độ tổng thể

| Hạng mục | Trạng thái | % |
|----------|------------|---|
| Authentication backend | Done | 100% |
| Authorization (RBAC) | Done | 100% |
| JWT authentication | Done | 100% |
| Security config refinement | Done | 100%|
| Booking API backend | Done | 100% |
| Booking UI frontend | Done | 100% |
| API integration booking | Đang làm | 100% |

**Tổng tiến độ:**100%

---

## 3. Kế hoạch tuần tới

| Thành viên | Công việc dự kiến |
|------------|-------------------|
| Hồ Lê Thảo Nguyên | Hoàn thiện xử lý lỗi auth/booking, hỗ trợ security cho module medical record |
| Nguyễn Cẩm Hiền | Hoàn thiện UI lịch sử đặt khám và giao diện doctor/patient flow |
| Trần Văn Trí Hửu | Mở rộng backend cho medical record, prescription, test request/result |

---

## 4. Khó khăn / Cần hỗ trợ

- Cần đồng bộ token flow giữa backend và frontend
- Cần thống nhất format response cho booking API
- Booking business logic còn cần refine thêm ở validate slot và quyền hủy lịch
- JWT hiện mới ở mức access token cơ bản, chưa có refresh token

---

**Ngày nộp:** [29/03/2026]  
**Xác nhận của Nhóm trưởng:** [Trần Văn Trí Hửu]