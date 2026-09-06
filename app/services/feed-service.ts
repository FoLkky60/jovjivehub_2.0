import { getDatabase } from "@/app/lib/mongodb";
import { FeedPost } from "@/app/types/feed";

type FeedDocument = FeedPost & { _id?: string; createdAtDate: Date };

async function getCollection() {
  return (await getDatabase()).collection<FeedDocument>("feedPosts");
}

function withoutDatabaseFields(post: FeedDocument): FeedPost {
  const { _id, createdAtDate, ...result } = post;
  void _id;
  void createdAtDate;
  return result;
}

export async function listFeedPosts() {
  const collection = await getCollection();
  const posts = await collection.find({}, { projection: { _id: 0, createdAtDate: 0 } }).sort({ createdAtDate: -1 }).toArray();
  return posts as FeedPost[];
}

export async function insertFeedPost(post: Omit<FeedPost, "id" | "createdAt">) {
  const collection = await getCollection();
  const document: FeedDocument = { ...post, id: `post-${Date.now()}`, createdAt: "just now", createdAtDate: new Date() };
  await collection.insertOne(document);
  return withoutDatabaseFields(document);
}

export async function updateFeedPost(postId: string, action: string, text?: string) {
  const collection = await getCollection();
  const post = await collection.findOne({ id: postId });
  if (!post) return null;
  const update = action === "like"
    ? { $set: { likedByMe: !post.likedByMe }, $inc: { likes: post.likedByMe ? -1 : 1 } }
    : action === "share"
      ? { $set: { sharedByMe: !post.sharedByMe } }
      : action === "edit" && text?.trim()
        ? { $set: { text: text.trim() } }
        : action === "comment" && text?.trim()
          ? { $push: { comments: { id: `comment-${Date.now()}`, author: "Jovjive listener", text: text.trim() } } }
          : null;
  if (!update) return withoutDatabaseFields(post);
  await collection.updateOne({ id: postId }, update as never);
  const updated = await collection.findOne({ id: postId });
  return updated ? withoutDatabaseFields(updated) : null;
}

export async function removeFeedPost(postId: string) {
  const collection = await getCollection();
  return (await collection.deleteOne({ id: postId })).deletedCount > 0;
}