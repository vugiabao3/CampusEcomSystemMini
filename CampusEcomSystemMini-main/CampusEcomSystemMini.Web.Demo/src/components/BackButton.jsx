// Nút "← Quay lại" dùng chung cho mọi trang và module.
//
// Mỗi trang truyền vào đúng handler quay lại màn hình trước đó,
// nên không phát sinh thêm hệ thống điều hướng nào.
export default function BackButton({
  onClick,
  label = "Quay lại",
  title,
  disabled = false,
  className = "",
}) {
  const classes = className
    ? `nav-back-btn ${className}`
    : "nav-back-btn";

  return (
    <button
      className={classes}
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title ?? label}
    >
      <span className="nav-back-arrow" aria-hidden="true">
        ←
      </span>

      <span>{label}</span>
    </button>
  );
}