"use client";

import { useMemo, useState } from "react";
import { RoomCard } from "@/app/component/RoomCard";
import { TopBar } from "@/app/component/TopBar";
import { getMockRooms } from "@/app/services/mock-room-service";

const topics = ["All rooms", "Life & feelings", "Music lounge", "Startup & work", "Movies"];

export function HomeDashboardPage() {
  const rooms = getMockRooms();
  const [activeTopic, setActiveTopic] = useState("All rooms");
  const [query, setQuery] = useState("");
  const visibleRooms = useMemo(
    () => rooms.filter((room) => {
      const matchesTopic = activeTopic === "All rooms" || room.topic === activeTopic;
      const searchText = `${room.title} ${room.host} ${room.topic}`.toLowerCase();
      return matchesTopic && searchText.includes(query.toLowerCase());
    }),
    [activeTopic, query, rooms],
  );

  return (
    <div className="app-shell">
      <TopBar activePath="/" />
      <main className="home-content">
        <section className="home-hero">
          <div>
            <div className="eyebrow"><span className="pulse" /> THE LIVING ROOM OF THE INTERNET</div>
            <h1>Find a room<br /><em>worth staying in.</em></h1>
            <p>Real conversations, happening right now.<br />Drop in, listen close, and be part of it.</p>
          </div>
          <div className="hero-orbit"><span>12</span><small>rooms<br />live now</small></div>
        </section>

        <section className="home-toolbar" aria-label="Room filters">
          <div className="topic-tabs">
            {topics.map((topic) => <button className={activeTopic === topic ? "active" : ""} key={topic} onClick={() => setActiveTopic(topic)}>{topic}</button>)}
          </div>
          <label className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search rooms" aria-label="Search rooms" /></label>
        </section>

        <section className="rooms-section">
          <div className="section-title-row"><div><span className="section-kicker">CURATED FOR YOU</span><h2>Rooms happening now</h2></div><span className="room-result-count">{visibleRooms.length} rooms</span></div>
          {visibleRooms.length > 0 ? <div className="room-card-grid">{visibleRooms.map((room) => <RoomCard key={room.id} room={room} />)}</div> : <div className="empty-state"><strong>No rooms found</strong><span>Try another topic or search term.</span></div>}
        </section>
      </main>
    </div>
  );
}
