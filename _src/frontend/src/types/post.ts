export type Post = {
  id: number;
  title: string;
  content: string;
  username: string;
  image?: File | string;
  imageUrl?: string;
};
