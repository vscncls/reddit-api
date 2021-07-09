import { Post } from "./Posts";

export type PostDb = Post & {
  createAt: number;
};
