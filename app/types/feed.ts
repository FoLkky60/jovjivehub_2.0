export type FeedMediaType = "image" | "video";

export type FeedComment = {
  id: string;
  author: string;
  text: string;
};

export type FeedPost = {
  id: string;
  authorName: string;
  authorUsername: string;
  avatar: string;
  text: string;
  mediaType?: FeedMediaType;
  mediaUrl?: string;
  createdAt: string;
  likes: number;
  comments: FeedComment[];
  likedByMe: boolean;
  sharedByMe: boolean;
};
