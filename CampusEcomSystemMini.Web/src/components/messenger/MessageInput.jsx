// MESSENGER — MODULE_5 / BATCH 3
// Ô nhập tin nhắn. Gửi realtime qua
// SignalR /hubs/chat (chatHub.js).
import { useState } from "react";

export default function MessageInput({
  disabled,
  sending,
  onSend,
}) {
  const [content, setContent] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmed = (content ?? "").trim();

    if (!trimmed || sending || disabled) {
      return;
    }

    await onSend(trimmed);

    setContent("");
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        className="message-input-field"
        type="text"
        placeholder="Nhập tin nhắn..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        disabled={disabled || sending}
      />

      <button
        className="message-input-action"
        type="submit"
        disabled={disabled || sending || !content.trim()}
      >
        {sending ? "Đang gửi..." : "Gửi"}
      </button>
    </form>
  );
}
