// Nhóm nội dung bài đăng dùng chung cho UI.
// Giá trị gửi lên Backend (Type) theo đúng danh sách trong MODULE_1.
export const POST_TYPES = [
  { value: "Room", label: "Thuê & Ở ghép trọ" },
  { value: "Group", label: "Ghép nhóm học tập" },
  { value: "Lost", label: "Đồ bị mất (Lost)" },
  { value: "Found", label: "Đồ nhặt được (Found)" },
  { value: "library", label: "Tài liệu & Giáo trình" },
];

export const POST_TYPE_EMPTY = {
  value: "",
  label: "Chung",
};

// Đổi giá trị Type trả về từ Backend sang nhãn tiếng Việt.
export function getPostTypeLabel(value) {
  const type = POST_TYPES.find(
    (item) => item.value.toLowerCase() === (value || "").toLowerCase()
  );

  return type ? type.label : POST_TYPE_EMPTY.label;
}