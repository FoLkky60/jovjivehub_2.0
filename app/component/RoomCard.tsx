import Link from "next/link";
import { Room } from "@/app/types/room";

export function RoomCard({ room }: { room: Room }) {
  return (
    <Link className="room-card" href={`/roomPage/${room.id}`}>
      <div className="room-card-visual" style={{ background: room.avatar }}>
        <span className="room-card-topic">{room.topic}</span>
        <span className="room-card-initials">{room.initials}</span>
        <span className="room-card-live"><span className="pulse-dot" />LIVE</span>
      </div>
      <div className="room-card-body">
        <div className="room-card-heading">
          <h2>{room.title}</h2>
          <span className="room-card-listeners">◉ {room.listeners}</span>
        </div>
        <p>Hosted by <strong>@{room.host}</strong></p>
        <span className="room-card-link">Enter room <span>↗</span></span>
      </div>
    </Link>
  );
}
