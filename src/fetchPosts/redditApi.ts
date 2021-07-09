import axios from "axios";
import { Post } from "./Posts";

type RedditApiResponse = {
  data: {
    children: Array<{
      data: {
        title: string;
        author_fullname: string;
        created_utc: number;
        ups: number;
        num_comments: number;
      };
    }>;
  };
};

export const fetchPosts = async (subreddit: string): Promise<Post[]> => {
  const posts = await axios.get<RedditApiResponse>(`https://api.reddit.com/r/${subreddit}/hot`);
  return posts.data.data.children.map(({ data: post }) => ({
    title: post.title,
    author: post.author_fullname,
    createdAt: new Date(post.created_utc * 1000),
    upvotes: post.ups,
    commentsCount: post.num_comments,
  }));
};
