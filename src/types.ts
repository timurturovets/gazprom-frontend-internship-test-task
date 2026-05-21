export interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

export interface CommentItem {
  id: number;
  post_id: number;
  name: string;
  email: string;
  body: string;
}

export type ViewMode = 'users' | 'posts';
