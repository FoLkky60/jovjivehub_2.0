import { getDatabase } from "@/app/lib/mongodb";
import { FeedPost } from "@/app/types/feed";
import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";

type FeedDocument = FeedPost & { _id?: ObjectId; createdAtDate: Date };

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
  const documents = await collection.find({}).sort({ createdAtDate: -1, _id: -1 }).toArray();
  const seen = new Set<string>();
  const duplicateIds: ObjectId[] = [];
  const posts = documents.filter((post) => {
    if (seen.has(post.id)) {
      if (post._id) duplicateIds.push(post._id);
      return false;
    }
    seen.add(post.id);
    return true;
  });
  if (duplicateIds.length > 0) await collection.deleteMany({ _id: { $in: duplicateIds } });
  await collection.createIndex({ id: 1 }, { unique: true }).catch(() => undefined);
  return posts.map(withoutDatabaseFields);
}

export async function insertFeedPost(post: Omit<FeedPost, "id" | "createdAt">) {
  const collection = await getCollection();
  const document: FeedDocument = { ...post, id: `post-${randomUUID()}`, createdAt: "just now", createdAtDate: new Date() };
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