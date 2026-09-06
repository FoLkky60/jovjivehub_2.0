"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RoomCard } from "@/app/component/RoomCard";
import { TopBar } from "@/app/component/TopBar";
import { Room } from "@/app/types/room";

export function FollowingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => { fetch("/api/rooms", { cache: "no-store" }).then((response) => response.json()).then((data: { rooms?: Room[] }) => setRooms(data.rooms ?? [])); }, []);
  const followedHosts = ["mewmew", "nana.wav"];
  const hostListRef = useRef<HTMLDivElement>(null);
  const followingRooms = rooms.filter((room) => followedHosts.includes(room.host));

  function scrollHosts(direction: "left" | "right") {
    hostListRef.current?.scrollBy({
      left: direction === "right" ? 220 : -220,
      behavior: "smooth",
    });
  }

  return (
    <div className="app-shell">
      <TopBar activePath="/following" />
      <main className="account-content following-content">
        <section className="following-hosts">
          <div className="section-title-row"><div><span className="section-kicker">YOUR HOSTS</span><h2>People you follow</h2></div><span className="room-result-count">{followedHosts.length} following</span></div>
          <div className="host-list-wrap">
            <button className="host-scroll-button host-scroll-left" onClick={() => scrollHosts("left")} aria-label="Scroll hosts left">‹</button>
            <div className="host-list" ref={hostListRef} aria-label="People you follow">
            {rooms.filter((room) => followedHosts.includes(room.host)).map((room) => {
              return (
                <article className="host-profile-card" key={room.host}>
                  <div className="host-profile-avatar" style={{ background: room.avatar }}>
                    {room.avatarUrl ? <Image src={room.avatarUrl} alt={`${room.host} profile`} fill sizes="72px" /> : room.initials}
                    <span className="host-live-indicator" />
                  </div>
                  <strong>@{room.host}</strong>
                  <p>{room.topic}</p>
                </article>
              );
            })}
            </div>
            <button className="host-scroll-button host-scroll-right" onClick={() => scrollHosts("right")} aria-label="Scroll hosts right">›</button>
          </div>
        </section>
        <section className="rooms-section following-rooms"><div className="section-title-row"><div><span className="section-kicker">LIVE RIGHT NOW</span><h2>From your hosts</h2></div><span className="room-result-count">{followingRooms.length} rooms</span></div>{followingRooms.length > 0 ? <div className="room-card-grid">{followingRooms.map((room) => <RoomCard key={room.id} room={room} />)}</div> : <div className="empty-state"><strong>Your feed is quiet</strong><span>Follow a host to see their live rooms here.</span></div>}</section>
      </main>
    </div>
  );
}
