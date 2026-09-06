import { NextResponse } from "next/server";
import { insertFeedPost, listFeedPosts } from "@/app/services/feed-service";
import { FeedMediaType } from "@/app/types/feed";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
  return NextResponse.json({ posts: await listFeedPosts(), source: "mongodb" });
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const mediaType = body.mediaType === "image" || body.mediaType === "video" ? body.mediaType as FeedMediaType : undefined;
  if (!text && !body.mediaUrl) return NextResponse.json({ error: "Post content is required" }, { status: 400 });
  const post = await insertFeedPost({
    authorName: user.name, authorUsername: user.username, avatar: user.avatar, text,
    mediaType, mediaUrl: typeof body.mediaUrl === "string" ? body.mediaUrl : undefined,
    likes: 0, comments: [], likedByMe: false, sharedByMe: false,
  });
  return NextResponse.json({ post, source: "mongodb" }, { status: 201 });
}