// Thanh điều hướng dùng chung cho Trang chủ và trang
// "Tất cả bài đăng" (Cộng đồng sinh viên).
//
// `onClick` là TÊN prop được truyền từ App.jsx, không phải
// function thật — mỗi trang tự map sang handler của mình.
export const CAMPUS_NAV_ITEMS = [
  {
    key: "community",
    label: "Cộng đồng",
    icon: "posts",
    onClick: "onOpenAllPosts",
  },
  {
    key: "matching",
    label: "Smart Matching",
    icon: "sparkles",
    onClick: "onOpenMatching",
  },
  {
    key: "lostfound",
    label: "Lost & Found",
    icon: "lostFound",
    onClick: "onOpenLostFound",
  },
  {
    key: "library",
    label: "Thư viện",
    icon: "book",
    onClick: "onOpenLibrary",
  },
  {
    key: "messenger",
    label: "Tin nhắn",
    icon: "chat",
    badge: "messenger",
    onClick: "onOpenMessenger",
  },
];