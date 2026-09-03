import { Room } from "@/app/types/room";

export function RoomList({
  rooms,
  activeRoomId,
  onSelect,
}: {
  rooms: Room[];
  activeRoomId: number;
  onSelect: (room: Room) => void;
}) {
  return (
    <div className="room-list" id="rooms">
      {rooms.map((room) => (
        <button
          className={`room-item ${activeRoomId === room.id ? "selected" : ""}`}
          key={room.id}
          onClick={() => onSelect(room)}
        >
          <span className="room-avatar" style={{ background: room.avatar }}>
            {room.initials}
          </span>
          <span className="room-copy">
            <strong>{room.title}</strong>
            <small>
              {room.host} <i>•</i> {room.listeners} listening
            </small>
          </span>
          <span className="room-live" style={{ color: room.color }}>
            LIVE
          </span>
        </button>
      ))}
    </div>
  );
}
