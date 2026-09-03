"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function TopBar({ activePath = "/" }: { activePath?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [roomTitle, setRoomTitle] = useState("");
  const [topic, setTopic] = useState("Life & feelings");
  const [created, setCreated] = useState(false);
  const [displayName, setDisplayName] = useState("Jovjive listener");
  const [username, setUsername] = useState("jovjive_user");
  const [bio, setBio] = useState("Here for good conversations.");

  function closeModal() {
    setIsOpen(false);
    setCreated(false);
    setRoomTitle("");
  }

  function createRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!roomTitle.trim()) return;
    setCreated(true);
  }

  function openProfileModal() {
    setIsProfileOpen(false);
    setIsProfileModalOpen(true);
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">j</span>
          <span>jovjive<span className="brand-accent">hub</span></span>
        </div>
        <nav className="topnav">
          <Link className={activePath === "/" ? "nav-active" : ""} href="/">Discover</Link>
          <Link className={activePath === "/following" ? "nav-active" : ""} href="/following">Following</Link>
          <Link className={activePath === "/about" ? "nav-active" : ""} href="/about">About</Link>
        </nav>
        <div className="top-actions">
          <button className="icon-button" aria-label="Search" onClick={() => alert("Mock search: try browsing live rooms")}>⌕</button>
          <button className="new-room" onClick={() => setIsOpen(true)}>＋ Open a room</button>
          <div className="profile-menu-wrap">
            <button
              className={`user-avatar profile-trigger ${isProfileOpen ? "active" : ""}`}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="Open profile menu"
              aria-expanded={isProfileOpen}
            >
              J
            </button>
            {isProfileOpen && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <span className="profile-menu-avatar">J</span>
                  <div>
                    <strong>{displayName}</strong>
                    <small>@{username}</small>
                  </div>
                </div>
                <div className="profile-menu-divider" />
                <span className="profile-menu-label">YOUR SPACE</span>
                <Link href="/savedPage">♡ <span>Saved rooms</span></Link>
                <Link href="/historyPage">◷ <span>Listening history</span></Link>
                <Link href="/settingsPage">⚙ <span>Settings</span></Link>
                <button className="manage-profile" onClick={openProfileModal}>
                  Manage profile <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
          <section className="room-modal" role="dialog" aria-modal="true" aria-labelledby="room-modal-title">
            <button className="modal-close" onClick={closeModal} aria-label="Close room form">×</button>
            {created ? (
              <div className="modal-success"><span className="success-mark">✓</span><h2>Your room is ready</h2><p>Mock room created. Invite people in and start the conversation.</p><button className="modal-primary" onClick={closeModal}>Done</button></div>
            ) : (
              <form onSubmit={createRoom}>
                <span className="section-kicker">START SOMETHING NEW</span>
                <h2 id="room-modal-title">Open a room</h2>
                <p className="modal-description">Create a space for the conversation you want to have tonight.</p>
                <label className="modal-label">Room name<input autoFocus value={roomTitle} onChange={(event) => setRoomTitle(event.target.value)} placeholder="Give your room a name" maxLength={60} required /></label>
                <label className="modal-label">Topic<select value={topic} onChange={(event) => setTopic(event.target.value)}><option>Life & feelings</option><option>Music lounge</option><option>Startup & work</option><option>Movies</option></select></label>
                <div className="modal-actions"><button type="button" className="modal-secondary" onClick={closeModal}>Cancel</button><button type="submit" className="modal-primary">Open room ↗</button></div>
              </form>
            )}
          </section>
        </div>
      )}

      {isProfileModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && setIsProfileModalOpen(false)}
        >
          <section className="room-modal profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title">
            <button className="modal-close" onClick={() => setIsProfileModalOpen(false)} aria-label="Close profile form">×</button>
            <span className="section-kicker">YOUR IDENTITY</span>
            <h2 id="profile-modal-title">Manage profile</h2>
            <p className="modal-description">Tell the room a little about the person behind the voice.</p>
            <div className="profile-edit-avatar">
              J
              <button aria-label="Change profile image">＋</button>
            </div>
            <label className="modal-label">Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={40} /></label>
            <label className="modal-label">Username<input value={username} onChange={(event) => setUsername(event.target.value.replace(/\s/g, ""))} maxLength={24} /></label>
            <label className="modal-label">Bio<textarea value={bio} onChange={(event) => setBio(event.target.value)} maxLength={120} rows={3} /></label>
            <div className="modal-actions">
              <button className="modal-secondary" onClick={() => setIsProfileModalOpen(false)}>Cancel</button>
              <button className="modal-primary" onClick={() => setIsProfileModalOpen(false)}>Save profile</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
