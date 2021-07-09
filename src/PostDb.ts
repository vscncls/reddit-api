import { Post } from "./fetchPosts/Posts";

export type PostDb = Post & {
  createAt: number;
};
