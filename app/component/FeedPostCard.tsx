"use client";

import Image from "next/image";
import { useState } from "react";
import { FeedPost } from "@/app/types/feed";
import { Icon } from "@iconify/react";

export function FeedPostCard({ initialPost, onPostChanged, onShare }: { initialPost: FeedPost; onPostChanged?: (post: FeedPost) => void; onShare?: (post: FeedPost) => void }) {
    const [post, setPost] = useState(initialPost);
    const [comment, setComment] = useState("");
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(initialPost.text);
    const isOwner = post.authorUsername === "jovjive_user";

    async function updatePost(action: "like" | "share") {
        const response = await fetch(`/api/feed/${post.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
        if (!response.ok) return;
        const { post: updatedPost } = await response.json() as { post: FeedPost };
        setPost(updatedPost); onPostChanged?.(updatedPost);
    }

    async function submitComment(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!comment.trim()) return;
        const response = await fetch(`/api/feed/${post.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "comment", text: comment.trim() }) });
        if (!response.ok) return;
        const { post: updatedPost } = await response.json() as { post: FeedPost };
        setPost(updatedPost); onPostChanged?.(updatedPost);
        setComment("");
        setCommentsOpen(true);
    }

    async function saveEdit() {
        if (!editText.trim()) return;
        const response = await fetch(`/api/feed/${post.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "edit", text: editText.trim() }) });
        if (!response.ok) return;
        const { post: updatedPost } = await response.json() as { post: FeedPost };
        setPost(updatedPost); onPostChanged?.(updatedPost);
        setIsEditing(false);
        setIsMenuOpen(false);
    }

    async function removePost() {
        if (!window.confirm("Delete this post?")) return;
        await fetch(`/api/feed/${post.id}`, { method: "DELETE" });
        onPostChanged?.({ ...post, id: "" });
    }

    return (
        <article className="feed-post">
            <header className="feed-post-header">
                <span className="feed-avatar" style={{ background: post.avatar }}>{post.authorName[0]}</span>
                <div><strong>{post.authorName}</strong><span>@{post.authorUsername} · {post.createdAt}</span></div>
                <button className="feed-more" aria-label="More post options" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Icon icon="mdi:dots-vertical" />
                </button>
                {isMenuOpen && <div className="feed-post-menu">{isOwner && <><button onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}>Edit post</button><button className="danger" onClick={removePost}>Delete post</button></>}{!isOwner && <button onClick={() => setIsMenuOpen(false)}>Report post</button>}</div>}
            </header>
            {isEditing ? <div className="feed-edit-form"><textarea value={editText} onChange={(event) => setEditText(event.target.value)} aria-label="Edit post" rows={3} /><div><button onClick={() => setIsEditing(false)}>Cancel</button><button className="feed-edit-save" onClick={saveEdit}>Save changes</button></div></div> : <p className="feed-post-text">{post.text}</p>}
            {post.mediaType === "image" && post.mediaUrl && <div className="feed-media"><Image src={post.mediaUrl} alt="Post media" fill sizes="(max-width: 700px) 100vw, 650px" unoptimized /></div>}
            {post.mediaType === "video" && post.mediaUrl && <video className="feed-media" controls preload="metadata" src={post.mediaUrl} />}
            <div className="feed-post-actions">
                <button className={post.likedByMe ? "active" : ""} onClick={() => updatePost("like")} aria-label="Like post">{post.likedByMe ? "♥" : "♡"} <span>{post.likes}</span></button>
                <button className={commentsOpen ? "active" : ""} onClick={() => setCommentsOpen(!commentsOpen)} aria-label="Show comments">◌ <span>Comment {post.comments.length}</span></button>
                <button className={post.sharedByMe ? "active" : ""} onClick={() => onShare ? onShare(post) : updatePost("share")} aria-label="Share post">↗ <span>{post.sharedByMe ? "Shared" : "Share"}</span></button>
            </div>
            {commentsOpen && <div className="feed-comments">
                {post.comments.map((item) => <div className="feed-comment" key={item.id}><span className="feed-comment-avatar">{item.author[0].toUpperCase()}</span><p><strong>@{item.author}</strong>{item.text}</p></div>)}
                <form className="feed-comment-form" onSubmit={submitComment}><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write a comment..." aria-label="Write a comment" /><button type="submit" aria-label="Post comment">↗</button></form>
            </div>}
        </article>
    );
}
