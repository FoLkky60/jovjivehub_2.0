import { ChatMessage } from "@/app/types/room";

export function MessageItem({ message }: { message: ChatMessage }) {
  return (
    <div className={`message ${message.own ? "own-message" : ""}`}>
      <span className="message-avatar" style={{ background: message.avatar }}>
        {message.name[0].toUpperCase()}
      </span>
      <div>
        <div className="message-meta">
          <strong>{message.name}</strong>
          <time>{message.time}</time>
        </div>
        <p>{message.text}</p>
      </div>
    </div>
  );
}
