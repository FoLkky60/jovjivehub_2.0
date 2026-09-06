"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useEffect, useState } from "react";
import { Room } from "@/app/types/room";
import { UserProfile } from "@/app/types/user";

export function TopBar({ activePath = "/", onRoomCreated }: { activePath?: string; onRoomCreated?: (room: Room) => void }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [roomTitle, setRoomTitle] = useState("");
  const [topic, setTopic] = useState("Life & feelings");
  const [created, setCreated] = useState(false);
  const [profile, setProfile] = useState<UserProfile>();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    fetch("/api/profile", { cache: "no-store" }).then((response) => response.ok ? response.json() : {}).then((data: { user?: UserProfile }) => {
      if (!data.user) { setProfile(undefined); return; }
      setProfile(data.user); setDisplayName(data.user.name); setUsername(data.user.username); setBio(data.user.bio);
    });
  }, []);

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    setProfile(undefined);
    setIsProfileOpen(false);
    router.push("/loginPage");
    router.refresh();
  }

  async function saveProfile() {
    const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: displayName, username, bio, avatar: profile?.avatar }) });
    if (response.ok) {
      const data = await response.json() as { user: UserProfile };
      setProfile(data.user); setDisplayName(data.user.name); setUsername(data.user.username); setBio(data.user.bio); setIsProfileModalOpen(false);
    }
  }

  function closeModal() {
    setIsOpen(false);
    setCreated(false);
    setRoomTitle("");
  }

  async function createRoom(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!roomTitle.trim()) return;
    const response = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: roomTitle.trim(), topic }),
    });
    if (!response.ok) return;
    const data = await response.json() as { room: Room };
    onRoomCreated?.(data.room);
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
          <Link className={activePath === "/feed" ? "nav-active" : ""} href="/feed">Feed</Link>
          <Link className={activePath === "/following" ? "nav-active" : ""} href="/following">Following</Link>
        </nav>
        <div className="top-actions">
          <button className="new-room" onClick={() => setIsOpen(true)}>＋ Open a room</button>
          <div className="profile-menu-wrap">
            <button
              className={`user-avatar profile-trigger ${isProfileOpen ? "active" : ""}`}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="Open profile menu"
              aria-expanded={isProfileOpen}
            >
              {profile?.name?.[0]?.toUpperCase() ?? "U"}
            </button>
            {isProfileOpen && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <span className="profile-menu-avatar">{profile?.name?.[0]?.toUpperCase() ?? "U"}</span>
                  <div>
                    <strong>{profile?.name ?? "Loading..."}</strong>
                    <small>@{profile?.username ?? ""}</small>
                  </div>
                </div>
                <div className="profile-menu-divider" />
                <span className="profile-menu-label">YOUR SPACE</span>
                <Link href="/profilePage">◉ <span>Profile</span></Link>
                <Link href="/savedPage">♡ <span>Saved posts</span></Link>
                <Link href="/historyPage">◷ <span>Listening history</span></Link>
                <Link href="/settingsPage">⚙ <span>Settings</span></Link>
                {profile ? <>
                  <button className="manage-profile" onClick={logout}>↪ <span>Logout</span></button>
                </> : <>
                  <Link href="/loginPage">↪ <span>Sign in</span></Link>
                  <Link href="/registerPage">＋ <span>Create account</span></Link>
                </>}
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
              <div className="modal-success"><span className="success-mark">✓</span><h2>Your room is ready</h2><p>Your room is live. Invite people in and start the conversation.</p><button className="modal-primary" onClick={closeModal}>Done</button></div>
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
              {profile?.name?.[0]?.toUpperCase() ?? "U"}
              <button aria-label="Change profile image">＋</button>
            </div>
            <label className="modal-label">Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={40} /></label>
            <label className="modal-label">Username<input value={username} onChange={(event) => setUsername(event.target.value.replace(/\s/g, ""))} maxLength={24} /></label>
            <label className="modal-label">Bio<textarea value={bio} onChange={(event) => setBio(event.target.value)} maxLength={120} rows={3} /></label>
            <div className="modal-actions">
              <button className="modal-secondary" onClick={() => setIsProfileModalOpen(false)}>Cancel</button>
              <button className="modal-primary" onClick={saveProfile}>Save profile</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
