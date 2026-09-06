import { NextResponse } from "next/server";
import { removeFeedPost, updateFeedPost } from "@/app/services/feed-service";

type RouteContext = { params: Promise<{ postId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { postId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const post = await updateFeedPost(postId, body.action, body.text);
  return post ? NextResponse.json({ post, source: "mongodb" }) : NextResponse.json({ error: "Post not found" }, { status: 404 });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { postId } = await context.params;
  return await removeFeedPost(postId)
    ? NextResponse.json({ source: "mongodb" })
    : NextResponse.json({ error: "Post not found" }, { status: 404 });
}