// Lấy 2 chữ cái đầu của tên và họ để làm avatar fallback
// khi người dùng chưa cập nhật ảnh đại diện.
export function getInitials(fullName) {
  return (
    String(fullName ?? "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(-2)
      .join("")
      .toUpperCase() || "SV"
  );
}