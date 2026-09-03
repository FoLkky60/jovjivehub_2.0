export type Room = {
  id: number;
  title: string;
  host: string;
  topic: string;
  listeners: string;
  color: string;
  initials: string;
  avatar: string;
  avatarUrl?: string;
};

export type ChatMessage = {
  id: string;
  name: string;
  text: string;
  time: string;
  avatar: string;
  own?: boolean;
};
