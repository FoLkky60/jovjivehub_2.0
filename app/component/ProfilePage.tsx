"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/app/component/TopBar";
import { FeedPostCard } from "@/app/component/FeedPostCard";
import { FeedPost } from "@/app/types/feed";
import { UserProfile } from "@/app/types/user";

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profilePosts, setProfilePosts] = useState<FeedPost[]>([]);
  useEffect(() => {
    fetch("/api/profile", { cache: "no-store" }).then((response) => response.json()).then((data: { user?: UserProfile }) => {
      if (!data.user) return;
      setProfile(data.user); setDisplayName(data.user.name); setUsername(data.user.username); setBio(data.user.bio);
    });
  }, []);
  useEffect(() => { if (profile) fetch("/api/feed", { cache: "no-store" }).then((response) => response.json()).then((data: { posts?: FeedPost[] }) => setProfilePosts((data.posts ?? []).filter((post) => post.authorUsername === profile.username || post.sharedByMe))); }, [profile]);

  async function saveProfile() {
    const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: displayName, username, bio, avatar: profile?.avatar }) });
    if (!response.ok) return;
    const data = await response.json() as { user: UserProfile };
    setProfile(data.user); setDisplayName(data.user.name); setUsername(data.user.username); setBio(data.user.bio); setIsEditing(false);
  }

  return (
    <div className="app-shell">
      <TopBar activePath="/profilePage" />
      <main className="profile-page-content">
        <section className="profile-cover">
          <div className="profile-page-avatar">{profile?.name?.[0]?.toUpperCase() ?? "U"}</div>
        </section>
        <section className="profile-page-header">
          <div>
            <span className="section-kicker">LISTENER PROFILE</span>
            <h1>{profile?.name ?? "Loading profile..."}</h1>
            <p>@{profile?.username ?? ""}</p>
            <span className="profile-bio">{bio}</span>
          </div>
          <button className="profile-edit-button" onClick={() => setIsEditing(true)}>Edit profile</button>
        </section>
        {/* <div className="profile-stats"><span><strong>12</strong> rooms joined</span><span><strong>2</strong> following</span><span><strong>18</strong> conversations</span></div> */}
        <section className="profile-rooms"><div className="section-title-row"><div><span className="section-kicker">YOUR ACTIVITY</span><h2>Posts you shared</h2></div></div><div className="profile-post-list">{profilePosts.map((post, index) => <FeedPostCard key={`${post.id}-${index}`} initialPost={post} />)}</div></section>
      </main>
      {isEditing && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsEditing(false)}><section className="room-modal" role="dialog" aria-modal="true" aria-labelledby="profile-page-edit-title"><button className="modal-close" onClick={() => setIsEditing(false)} aria-label="Close edit profile">×</button><span className="section-kicker">YOUR IDENTITY</span><h2 id="profile-page-edit-title">Edit profile</h2><label className="modal-label">Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label><label className="modal-label">Username<input value={username} onChange={(event) => setUsername(event.target.value.replace(/\s/g, ""))} /></label><label className="modal-label">Bio<textarea rows={3} value={bio} onChange={(event) => setBio(event.target.value)} /></label><div className="modal-actions"><button className="modal-secondary" onClick={() => setIsEditing(false)}>Cancel</button><button className="modal-primary" onClick={saveProfile}>Save profile</button></div></section></div>}
    </div>
  );
}
