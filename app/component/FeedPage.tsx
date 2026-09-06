"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FeedPostCard } from "@/app/component/FeedPostCard";
import { TopBar } from "@/app/component/TopBar";
import { FeedMediaType, FeedPost } from "@/app/types/feed";

export function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [text, setText] = useState("");
  const [mediaType, setMediaType] = useState<FeedMediaType | undefined>();
  const [mediaUrl, setMediaUrl] = useState<string>();
  const [sharePost, setSharePost] = useState<FeedPost>();
  const [shareText, setShareText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    fetch("/api/feed", { cache: "no-store" }).then((response) => response.json()).then((data: { posts?: FeedPost[] }) => setPosts(data.posts ?? []));
  }, []);

  function chooseMedia(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaType(file.type.startsWith("video/") ? "video" : "image");
    setMediaUrl(URL.createObjectURL(file));
  }

  async function publishPost() {
    if (!text.trim() && !mediaUrl) return;
    const response = await fetch("/api/feed", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: text.trim(), mediaType, mediaUrl }) });
    if (!response.ok) return;
    const { post } = await response.json() as { post: FeedPost };
    setPosts((currentPosts) => [post, ...currentPosts]);
    setText("");
    setMediaType(undefined);
    setMediaUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function publishShare() {
    if (!sharePost) return;
    const response = await fetch("/api/feed", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: shareText.trim() || `Shared from @${sharePost.authorUsername}`, mediaType: sharePost.mediaType, mediaUrl: sharePost.mediaUrl }) });
    if (!response.ok) return;
    const { post: sharedPost } = await response.json() as { post: FeedPost };
    setPosts((currentPosts) => [sharedPost, ...currentPosts]);
    setSharePost(undefined);
    setShareText("");
  }

  return (
    <div className="app-shell">
      <TopBar activePath="/feed" />
      <main className="feed-page">
        <section className="feed-intro"><span className="section-kicker">THE JOVJIVE FEED</span><h1>What&apos;s on your mind?</h1><p>Share a moment, a thought, or something worth talking about.</p></section>
        <section className="post-composer">
          <div className="composer-top"><span className="feed-avatar">J</span><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Start a post..." aria-label="Post text" rows={3} /></div>
          {mediaUrl && <div className="composer-preview">{mediaType === "video" ? <video controls src={mediaUrl} /> : <Image src={mediaUrl} alt="Selected post preview" width={640} height={360} unoptimized />}<button onClick={() => { URL.revokeObjectURL(mediaUrl); setMediaUrl(undefined); setMediaType(undefined); if (fileInputRef.current) fileInputRef.current.value = ""; }} aria-label="Remove selected media">×</button></div>}
          <div className="composer-actions"><input ref={fileInputRef} type="file" accept="image/*" onChange={chooseMedia} hidden /><input ref={videoInputRef} type="file" accept="video/*" onChange={chooseMedia} hidden /><button onClick={() => fileInputRef.current?.click()}>▧ Photo</button><button onClick={() => videoInputRef.current?.click()}>▶ Video</button><button className="composer-publish" onClick={publishPost}>Post ↗</button></div>
        </section>
        <div className="feed-list">{posts.map((post) => <FeedPostCard key={post.id} initialPost={post} onPostChanged={(updatedPost) => setPosts((currentPosts) => updatedPost.id ? currentPosts.map((currentPost) => currentPost.id === updatedPost.id ? updatedPost : currentPost) : currentPosts.filter((currentPost) => currentPost.id !== post.id))} onShare={(postToShare) => setSharePost(postToShare)} />)}</div>
      </main>
      {sharePost && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSharePost(undefined)}><section className="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-modal-title"><button className="modal-close" onClick={() => setSharePost(undefined)} aria-label="Close share dialog">×</button><h2 id="share-modal-title">Share</h2><div className="share-author"><span className="feed-avatar">J</span><div><strong>Jovjive listener</strong><span>Feed · Public</span></div></div><textarea value={shareText} onChange={(event) => setShareText(event.target.value)} placeholder="Say something about this..." aria-label="Share caption" rows={3} /><div className="share-preview"><strong>@{sharePost.authorUsername}</strong><p>{sharePost.text}</p>{sharePost.mediaType && <span>{sharePost.mediaType === "image" ? "▧ Photo" : "▶ Video"}</span>}</div><button className="modal-primary share-submit" onClick={publishShare}>Share now ↗</button></section></div>}
    </div>
  );
}
