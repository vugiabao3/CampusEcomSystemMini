import { useState } from "react";

import {
  DOCUMENT_ACCEPT_ATTRIBUTE,
  DOCUMENT_ACCEPTED_EXTENSIONS,
  DOCUMENT_MAX_FILE_SIZE_BYTES,
  DOCUMENT_PRICING_TYPES,
} from "../../services/libraryService.js";

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Form đăng tài liệu.
//
// Workflow Upload tài liệu:
//   Tên tài liệu → Môn học → Miễn phí / Có phí → Giá điểm → Chọn PDF/DOCX
//
// document = object => sửa metadata tài liệu đã có (không đổi file)
// document = null  => đăng tài liệu mới
//
// Không có ô nhập UserId: người đăng lấy từ JWT ở Backend.
export default function DocumentForm({
  document,
  saving,
  error,
  onSubmit,
  onClose,
}) {
  const isEdit = Boolean(document);

  const [title, setTitle] = useState(document?.title ?? "");

  const [subject, setSubject] = useState(document?.subject ?? "");

  const [description, setDescription] = useState(
    document?.description ?? ""
  );

  // Tài liệu đã đăng không đổi PricingType ở batch này.
  const [pricing, setPricing] = useState(
    document?.pricingType === "Paid" ? "Paid" : "Free"
  );

  const [price, setPrice] = useState(
    document?.price ? String(document.price) : ""
  );

  const [file, setFile] = useState(null);

  const [validationError, setValidationError] = useState("");

  const isPaid = pricing === "Paid";

  // Chỉ bắt buộc khi đăng tài liệu mới,
  // sửa metadata thì không thay file gốc.
  const needsFile = !isEdit;

  function handleFileChange(event) {
    setValidationError("");
    setFile(event.target.files?.[0] ?? null);
  }

  function handlePricingChange(value) {
    setPricing(value);

    // Tài liệu miễn phí không có giá điểm.
    if (value === "Free") {
      setPrice("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setValidationError("");

    if (!title.trim()) {
      setValidationError("Vui lòng nhập tên tài liệu.");
      return;
    }

    if (!subject.trim()) {
      setValidationError("Vui lòng nhập môn học hoặc khoa.");
      return;
    }

    if (isPaid && !(Number(price) > 0)) {
      setValidationError(
        "Tài liệu trả phí cần giá điểm lớn hơn 0."
      );
      return;
    }

    if (needsFile) {
      if (!file) {
        setValidationError("Vui lòng chọn file PDF hoặc DOCX.");
        return;
      }

      if (file.size <= 0) {
        setValidationError("File đã chọn rỗng.");
        return;
      }

      if (file.size > DOCUMENT_MAX_FILE_SIZE_BYTES) {
        setValidationError(
          "File vượt quá giới hạn 25MB."
        );
        return;
      }

      const extension = file.name.split(".").pop()?.toLowerCase();

      if (!DOCUMENT_ACCEPTED_EXTENSIONS.includes(extension)) {
        setValidationError(
          "Chỉ chấp nhận file PDF hoặc DOCX."
        );
        return;
      }
    }

    await onSubmit({
      title: title.trim(),
      subject: subject.trim(),
      description: description.trim(),
      pricing,
      price: isPaid ? Number(price) : 0,
      file: needsFile ? file : null,
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Đóng"
          onClick={onClose}
          disabled={saving}
        >
          ×
        </button>

        <form className="auth-form modal-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <span className="eyebrow">KHO TÀI LIỆU SỐ</span>

            <h2>
              {isEdit ? "Sửa tài liệu" : "Đăng tải tài liệu"}
            </h2>

            <p>
              {isEdit
                ? "Chỉ sửa thông tin tài liệu. File gốc giữ nguyên."
                : "Chia sẻ tài liệu học tập với sinh viên trong trường."}
            </p>
          </div>

          {validationError && (
            <div className="message message-error" role="alert">
              {validationError}
            </div>
          )}

          {error && (
            <div className="message message-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="doc-title">Tên tài liệu</label>

            <input
              id="doc-title"
              type="text"
              placeholder="Giáo trình Giải tích 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="doc-subject">Môn học / Khoa</label>

            <input
              id="doc-subject"
              type="text"
              placeholder="Toán học"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="doc-pricing">
              Miễn phí / Có phí
            </label>

            <select
              id="doc-pricing"
              value={pricing}
              onChange={(e) => handlePricingChange(e.target.value)}
              disabled={isEdit}
            >
              {DOCUMENT_PRICING_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            {isEdit && (
              <span className="doc-form-hint">
                Loại giá cố định sau khi đăng tài liệu.
              </span>
            )}
          </div>

          {isPaid && (
            <div className="form-group">
              <label htmlFor="doc-price">Giá điểm</label>

              <input
                id="doc-price"
                type="number"
                min="1"
                step="1"
                placeholder="15"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="doc-description">Mô tả</label>

            <textarea
              id="doc-description"
              rows={4}
              placeholder="Tóm tắt nội dung tài liệu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {needsFile && (
            <div className="form-group">
              <label htmlFor="doc-file">
                File tài liệu (PDF / DOCX, tối đa 25MB)
              </label>

              <input
                id="doc-file"
                type="file"
                accept={DOCUMENT_ACCEPT_ATTRIBUTE}
                onChange={handleFileChange}
                required
              />

              {file && (
                <span className="doc-form-hint">
                  {file.name} · {formatFileSize(file.size)}
                </span>
              )}
            </div>
          )}

          <div className="posts-actions">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Đăng tải"}
            </button>

            <button
              className="btn btn--ghost"
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}