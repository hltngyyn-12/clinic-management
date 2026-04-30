const alertMessageMap = new Map([
  ["Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."],
  ["Vui lòng nhập đầy đủ tên đăng nhập hoặc email và mật khẩu.", "Vui lòng nhập đủ thông tin đăng nhập."],
  ["Hệ thống chưa trả về thông tin phiên đăng nhập.", "Không thể khởi tạo phiên đăng nhập."],
  ["Đăng nhập thành công.", "Đăng nhập thành công."],
  ["Đăng nhập thất bại.", "Không thể đăng nhập. Vui lòng thử lại."],
  ["Vui lòng điền đầy đủ thông tin đăng ký tài khoản.", "Vui lòng điền đủ thông tin đăng ký."],
  ["Tạo tài khoản thành công.", "Tạo tài khoản thành công."],
  ["Tạo tài khoản thất bại.", "Không thể tạo tài khoản. Vui lòng thử lại."],
  ["Đặt lịch thành công.", "Đặt lịch thành công."],
  ["Đặt lịch thất bại.", "Không thể đặt lịch. Vui lòng thử lại."],
  ["Đặt lịch khám thành công.", "Đặt lịch khám thành công."],
  ["Đặt lịch khám thất bại.", "Không thể đặt lịch khám. Vui lòng thử lại."],
  ["Không tải được khung giờ khám.", "Không thể tải khung giờ khám."],
  ["Không tải được đánh giá bác sĩ.", "Không thể tải đánh giá bác sĩ."],
  ["Không tải được không gian làm việc của bác sĩ.", "Không thể tải không gian làm việc của bác sĩ."],
  ["Không tải được lịch sử bệnh nhân.", "Không thể tải lịch sử bệnh nhân."],
  ["Vui lòng chọn một lịch khám trước.", "Vui lòng chọn lịch khám trước."],
  ["Tạo hồ sơ khám bệnh thành công.", "Đã tạo hồ sơ khám bệnh."],
  ["Tạo hồ sơ khám bệnh thất bại.", "Không thể tạo hồ sơ khám bệnh."],
  ["Vui lòng chọn hồ sơ khám trước.", "Vui lòng chọn hồ sơ khám trước."],
  ["Kê đơn thuốc thành công.", "Đã kê đơn thuốc."],
  ["Kê đơn thuốc thất bại.", "Không thể kê đơn thuốc."],
  ["Tạo yêu cầu xét nghiệm thành công.", "Đã tạo yêu cầu xét nghiệm."],
  ["Tạo yêu cầu xét nghiệm thất bại.", "Không thể tạo yêu cầu xét nghiệm."],
  ["Không tải được hồ sơ bác sĩ.", "Không thể tải hồ sơ bác sĩ."],
  ["Cập nhật hồ sơ bác sĩ thành công.", "Đã cập nhật hồ sơ bác sĩ."],
  ["Cập nhật hồ sơ bác sĩ thất bại.", "Không thể cập nhật hồ sơ bác sĩ."],
  ["Không tải được dữ liệu bác sĩ.", "Không thể tải danh sách bác sĩ."],
  ["Cập nhật bác sĩ thành công.", "Đã cập nhật bác sĩ."],
  ["Tạo mới tài khoản bác sĩ thành công.", "Đã tạo tài khoản bác sĩ."],
  ["Lưu thông tin bác sĩ thất bại.", "Không thể lưu thông tin bác sĩ."],
  ["Xóa bác sĩ thành công.", "Đã xóa bác sĩ."],
  ["Xóa bác sĩ thất bại.", "Không thể xóa bác sĩ."],
  ["Không tải được dữ liệu danh mục hệ thống.", "Không thể tải dữ liệu danh mục."],
  ["Tạo chuyên khoa thành công.", "Đã tạo chuyên khoa."],
  ["Cập nhật chuyên khoa thành công.", "Đã cập nhật chuyên khoa."],
  ["Lưu chuyên khoa thất bại.", "Không thể lưu chuyên khoa."],
  ["Tạo thuốc thành công.", "Đã tạo thuốc."],
  ["Cập nhật thuốc thành công.", "Đã cập nhật thuốc."],
  ["Lưu thuốc thất bại.", "Không thể lưu thuốc."],
  ["Xóa chuyên khoa thất bại.", "Không thể xóa chuyên khoa."],
  ["Xóa thuốc thất bại.", "Không thể xóa thuốc."],
  ["Không tải được dữ liệu vận hành phòng khám.", "Không thể tải dữ liệu vận hành."],
  ["Tạo cấu hình slot khám thành công.", "Đã tạo cấu hình slot khám."],
  ["Cập nhật cấu hình slot khám thành công.", "Đã cập nhật cấu hình slot khám."],
  ["Lưu cấu hình slot khám thất bại.", "Không thể lưu cấu hình slot khám."],
  ["Tạo thông báo thành công.", "Đã tạo thông báo."],
  ["Cập nhật thông báo thành công.", "Đã cập nhật thông báo."],
  ["Lưu thông báo thất bại.", "Không thể lưu thông báo."],
  ["Không tải được báo cáo doanh thu.", "Không thể tải báo cáo doanh thu."],
  ["Xóa cấu hình slot khám thất bại.", "Không thể xóa cấu hình slot khám."],
  ["Xóa thông báo thất bại.", "Không thể xóa thông báo."],
  ["Khởi tạo thanh toán MoMo ATM thất bại.", "Không thể khởi tạo thanh toán."],
  ["Gửi đánh giá thành công.", "Đã gửi đánh giá."],
  ["Gửi đánh giá thất bại.", "Không thể gửi đánh giá."],
]);

const confirmMessageMap = new Map([
  ["Bạn có chắc muốn xóa bác sĩ này khỏi hệ thống?", "Xác nhận xóa bác sĩ này?"],
  ["Bạn có chắc muốn xóa chuyên khoa này?", "Xác nhận xóa chuyên khoa này?"],
  ["Bạn có chắc muốn xóa thuốc này?", "Xác nhận xóa thuốc này?"],
  ["Bạn có chắc muốn xóa cấu hình slot khám này?", "Xác nhận xóa cấu hình slot khám này?"],
  ["Bạn có chắc muốn xóa thông báo này?", "Xác nhận xóa thông báo này?"],
]);

const mojibakeFixes = [
  ["PhiĂªn", "Phiên"],
  ["Ä‘Äƒng", "đăng"],
  ["nháº­p", "nhập"],
  ["Ä‘Ã£", "đã"],
  ["Ä‘Ã", "đ"],
  ["háº¿t", "hết"],
  ["háº¡n", "hạn"],
  ["Vui lĂ²ng", "Vui lòng"],
  ["Ä‘áº§y", "đầy"],
  ["Ä‘á»§", "đủ"],
  ["thĂ´ng", "thông"],
  ["thĂ nh cĂ´ng", "thành công"],
  ["tháº¥t báº¡i", "thất bại"],
  ["KhĂ´ng", "Không"],
  ["táº£i Ä‘Æ°á»£c", "tải được"],
  ["khĂ´ng gian lĂ m viá»‡c", "không gian làm việc"],
  ["lá»‹ch sá»­", "lịch sử"],
  ["bá»‡nh nhĂ¢n", "bệnh nhân"],
  ["Táº¡o", "Tạo"],
  ["KĂª", "Kê"],
  ["Äang", "Đang"],
  ["há»“ sÆ¡", "hồ sơ"],
  ["thuá»‘c", "thuốc"],
  ["xĂ©t nghiá»‡m", "xét nghiệm"],
  ["Cáº­p nháº­t", "Cập nhật"],
  ["XĂ³a", "Xóa"],
  ["chuyĂªn khoa", "chuyên khoa"],
  ["dá»¯ liá»‡u", "dữ liệu"],
  ["váº­n hĂ nh", "vận hành"],
  ["bĂ¡o cĂ¡o", "báo cáo"],
  ["Ä‘Ă¡nh giĂ¡", "đánh giá"],
  ["Äáº·t", "Đặt"],
  ["lá»‹ch", "lịch"],
  ["Ä‘iá»‡n tá»­", "điện tử"],
  ["Há»‡", "Hệ"],
  ["ÄÄƒng", "Đăng"],
  ["Khá»Ÿi", "Khởi"],
  ["Gá»­i", "Gửi"],
  ["má»›i", "mới"],
  ["cáº¥u hĂ¬nh", "cấu hình"],
  ["thĂ´ng bĂ¡o", "thông báo"],
  ["quáº£n trá»‹", "quản trị"],
  ["phĂ²ng khĂ¡m", "phòng khám"],
  ["Ä‘á»“ng", "đồng"],
  ["Ä‘Æ¡n", "đơn"],
];

function repairMojibake(input) {
  if (typeof input !== "string") return input;
  return mojibakeFixes.reduce((result, [wrong, right]) => result.split(wrong).join(right), input);
}

export function normalizeAlertMessage(message) {
  const repaired = repairMojibake(String(message || "")).trim();
  return alertMessageMap.get(repaired) || repaired;
}

export function normalizeConfirmMessage(message) {
  const repaired = repairMojibake(String(message || "")).trim();
  return confirmMessageMap.get(repaired) || repaired;
}

export function inferToastTone(message) {
  const normalized = normalizeAlertMessage(message).toLowerCase();
  if (
    normalized.includes("không thể") ||
    normalized.includes("hết hạn") ||
    normalized.includes("đã xảy ra lỗi") ||
    normalized.includes("vui lòng")
  ) {
    return normalized.includes("vui lòng") && !normalized.includes("không thể") ? "warning" : "error";
  }
  if (normalized.includes("đã ") || normalized.includes("thành công")) {
    return "success";
  }
  return "info";
}

export function showToast(message, options = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("clinic:toast", {
      detail: {
        message: normalizeAlertMessage(message),
        tone: options.tone || inferToastTone(message),
        duration: options.duration ?? 3400,
      },
    }),
  );
}

export function confirmAction(message, options = {}) {
  if (typeof window === "undefined") return Promise.resolve(false);
  return new Promise((resolve) => {
    window.dispatchEvent(
      new CustomEvent("clinic:confirm", {
        detail: {
          message: normalizeConfirmMessage(message),
          title: options.title || "Xác nhận thao tác",
          confirmLabel: options.confirmLabel || "Xác nhận",
          cancelLabel: options.cancelLabel || "Hủy",
          tone: options.tone || "danger",
          resolve,
        },
      }),
    );
  });
}

export function initFeedbackUx() {
  if (typeof window === "undefined" || window.__clinicFeedbackUxPatched) {
    return;
  }

  window.alert = (message) => {
    showToast(message);
  };

  window.__clinicFeedbackUxPatched = true;
}
