"use client";

import { useRouter } from "next/navigation";
import { Room } from "@/app/types/room";
import { RoomList } from "@/app/component/RoomList";

export function Sidebar({
  rooms,
  activeRoomId,
  onSelect,
}: {
  rooms: Room[];
  activeRoomId: number;
  onSelect: (room: Room) => void;
}) {
  const router = useRouter();

  return (
    <aside className="sidebar">
      <div className="side-heading">
        <span>LIVE NOW</span>
        <span className="live-count">12 rooms</span>
      </div>
      <RoomList rooms={rooms} activeRoomId={activeRoomId} onSelect={onSelect} />
      <button
        className="see-all"
        onClick={() => router.push("/")}
      >
        See all rooms <span>→</span>
      </button>
      <div className="side-footer">
        <span className="status-dot"></span>All systems lively
      </div>
    </aside>
  );
}
