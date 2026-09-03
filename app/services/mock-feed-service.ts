import { FeedPost } from "@/app/types/feed";

let posts: FeedPost[] = [
  {
    id: "post-1",
    authorName: "Jovjive listener",
    authorUsername: "jovjive_user",
    avatar: "#ec765a",
    text: "คืนนี้เปิดห้องคุยเรื่องเพลงที่ทำให้เราผ่านวันแย่ ๆ มาได้ ใครมีเพลงในใจก็มาแชร์กันนะ",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
    createdAt: "12 min ago",
    likes: 24,
    comments: [{ id: "comment-1", author: "mewmew", text: "หัวข้อนี้ดีมาก เดี๋ยวแวะไปฟังนะ" }],
    likedByMe: true,
    sharedByMe: false,
  },
  {
    id: "post-2",
    authorName: "mewmew",
    authorUsername: "mewmew",
    avatar: "#d9795f",
    text: "เก็บบรรยากาศก่อนเริ่มห้อง Late night thoughts ไว้ตรงนี้ ใครยังไม่นอนแวะเข้ามาคุยกันได้",
    mediaType: "video",
    mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    createdAt: "38 min ago",
    likes: 86,
    comments: [],
    likedByMe: false,
    sharedByMe: true,
  },
  {
    id: "post-3",
    authorName: "nana.wav",
    authorUsername: "nana.wav",
    avatar: "#7653c8",
    text: "เพลงใหม่ที่วนฟังทั้งวัน ใครฟังแล้วรู้สึกยังไงบ้าง",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=900&q=80",
    createdAt: "1 hr ago",
    likes: 112,
    comments: [{ id: "comment-2", author: "goodday", text: "ฟังแล้วอยากออกไปขับรถเลย" }],
    likedByMe: false,
    sharedByMe: false,
  },
];

export function getFeedPosts(): FeedPost[] {
  return posts.map((post) => ({ ...post, comments: [...post.comments] }));
}

export function createFeedPost(text: string, mediaType?: FeedPost["mediaType"], mediaUrl?: string): FeedPost {
  const post: FeedPost = {
    id: `post-${Date.now()}`,
    authorName: "Jovjive listener",
    authorUsername: "jovjive_user",
    avatar: "#ec765a",
    text,
    mediaType,
    mediaUrl,
    createdAt: "just now",
    likes: 0,
    comments: [],
    likedByMe: false,
    sharedByMe: false,
  };
  posts = [post, ...posts];
  return { ...post, comments: [] };
}

export function createSharedFeedPost(originalPost: FeedPost, text: string): FeedPost {
  const post: FeedPost = {
    ...originalPost,
    id: `post-${Date.now()}`,
    authorName: "Jovjive listener",
    authorUsername: "jovjive_user",
    avatar: "#ec765a",
    text,
    createdAt: "just now",
    likes: 0,
    comments: [],
    likedByMe: false,
    sharedByMe: true,
  };
  posts = [post, ...posts];
  return { ...post, comments: [] };
}

export function togglePostLike(postId: string): FeedPost {
  posts = posts.map((post) => post.id === postId
    ? { ...post, likedByMe: !post.likedByMe, likes: post.likes + (post.likedByMe ? -1 : 1) }
    : post);
  return getFeedPosts().find((post) => post.id === postId)!;
}

export function addPostComment(postId: string, text: string): FeedPost {
  posts = posts.map((post) => post.id === postId
    ? { ...post, comments: [...post.comments, { id: `comment-${Date.now()}`, author: "Jovjive listener", text }] }
    : post);
  return getFeedPosts().find((post) => post.id === postId)!;
}

export function togglePostShare(postId: string): FeedPost {
  posts = posts.map((post) => post.id === postId ? { ...post, sharedByMe: !post.sharedByMe } : post);
  return getFeedPosts().find((post) => post.id === postId)!;
}

export function updateFeedPost(postId: string, text: string): FeedPost {
  posts = posts.map((post) => post.id === postId ? { ...post, text } : post);
  return getFeedPosts().find((post) => post.id === postId)!;
}

export function deleteFeedPost(postId: string): void {
  posts = posts.filter((post) => post.id !== postId);
}
