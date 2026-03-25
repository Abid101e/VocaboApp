export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Comment {
  id: string;
  postId: number;
  userId: string;
  userName: string;
  text: string;
  createdAt: number;
}
