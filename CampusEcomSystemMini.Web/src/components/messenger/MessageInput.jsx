// MESSENGER — MODULE_5 / BATCH 2
// Ô nhập tin nhắn.
// Gửi tin nhắn realtime qua SignalR thuộc BATCH 3,
// nên ô nhập tạm thời bị khóa cho đến khi bật chat.
import { useState } from "react";

export default function MessageInput({ disabled }) {
  const [content, setContent] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        className="message-input-field"
        type="text"
        placeholder="Nhập tin nhắn..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        disabled={disabled}
      />

      <button
        className="message-input-action"
        type="submit"
        disabled={disabled || !content.trim()}
      >
        Gửi
      </button>

      <span className="form-hint message-input-hint">
        Gửi tin nhắn realtime sẽ được bật khi chat SignalR
        hoạt động ở bản cập nhật tiếp theo.
      </span>
    </form>
  );
}
