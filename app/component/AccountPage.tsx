"use client";

import { useState } from "react";
import Link from "next/link";
import { TopBar } from "@/app/component/TopBar";
import { getMockRooms } from "@/app/services/mock-room-service";
import { FeedPostCard } from "@/app/component/FeedPostCard";
import { getFeedPosts } from "@/app/services/mock-feed-service";
import { FeedPost } from "@/app/types/feed";

const history = [
  { room: getMockRooms()[0], listened: "Today, 21:45", duration: "42 min" },
  { room: getMockRooms()[3], listened: "Yesterday, 22:10", duration: "18 min" },
];

export function AccountPage({ kind }: { kind: "saved" | "history" | "settings" }) {
  const [notifications, setNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [savedPosts, setSavedPosts] = useState<FeedPost[]>(() => getFeedPosts().filter((post) => post.likedByMe));

  return (
    <div className="app-shell">
      <TopBar activePath={`/${kind}Page`} />
      <main className="account-content">
        <Link className="back-link" href="/">← Back to discover</Link>
        {kind === "saved" && <><PageIntro eyebrow="YOUR SPACE" title="Saved posts" description="Posts you liked and want to come back to." /><div className="saved-post-list">{savedPosts.length > 0 ? savedPosts.map((post) => <FeedPostCard key={post.id} initialPost={post} onPostChanged={(updatedPost) => setSavedPosts((currentPosts) => updatedPost.likedByMe ? currentPosts.map((currentPost) => currentPost.id === updatedPost.id ? updatedPost : currentPost) : currentPosts.filter((currentPost) => currentPost.id !== updatedPost.id))} />) : <div className="empty-state"><strong>No saved posts yet</strong><span>Like a post in the feed to keep it here.</span></div>}</div></>}
        {kind === "history" && <><PageIntro eyebrow="YOUR SPACE" title="Listening history" description="A quiet trail of the rooms you have visited." /><div className="history-list">{history.map((item) => <div className="history-item" key={item.room.id}><span className="history-avatar" style={{ background: item.room.avatar }}>{item.room.initials}</span><div><strong>{item.room.title}</strong><p>@{item.room.host} · {item.listened}</p></div><span className="history-duration">{item.duration}</span><Link href={`/roomPage/${item.room.id}`}>Rejoin ↗</Link></div>)}</div></>}
        {kind === "settings" && <><PageIntro eyebrow="YOUR SPACE" title="Settings" description="Shape your Jovjivehub experience." /><div className="settings-list"><SettingRow title="Room notifications" description="Get notified when a saved host goes live." enabled={notifications} onToggle={() => setNotifications(!notifications)} /><SettingRow title="Private profile" description="Hide your listening activity from other people." enabled={privateProfile} onToggle={() => setPrivateProfile(!privateProfile)} /></div></>}
      </main>
    </div>
  );
}

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="account-intro"><span className="section-kicker">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>;
}

function SettingRow({ title, description, enabled, onToggle }: { title: string; description: string; enabled: boolean; onToggle: () => void }) {
  return <div className="setting-row"><div><strong>{title}</strong><p>{description}</p></div><button className={`toggle ${enabled ? "enabled" : ""}`} onClick={onToggle} aria-pressed={enabled} aria-label={`Toggle ${title}`}><span /></button></div>;
}
