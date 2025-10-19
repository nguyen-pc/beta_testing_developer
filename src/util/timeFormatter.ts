export function formatChatTime(isoString: string) {
  const date = new Date(isoString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  // Nếu cùng năm, bỏ năm cho gọn
  const sameYear = date.getFullYear() === now.getFullYear();

  if (isToday) {
    // chỉ hiển thị giờ:phút
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (isYesterday) {
    return (
      "Hôm qua " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  } else {
    return (
      (sameYear
        ? date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
        : date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })) +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }
}
