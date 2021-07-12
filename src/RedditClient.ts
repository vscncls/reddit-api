import axios from "axios";
import { Post } from "./Posts";

type RedditApiResponse = {
  data: {
    children: Array<{
      data: {
        title: string;
        author: string;
        created_utc: number;
        ups: number;
        num_comments: number;
      };
    }>;
  };
};

export class RedditClient {
  public async fetchPosts(subreddit: string): Promise<Post[]> {
    const response = await axios.get<RedditApiResponse>(`https://api.reddit.com/r/${subreddit}/hot`);

    return response.data.data.children.map(({ data: post }) => ({
      title: post.title,
      author: post.author,
      createdAt: new Date(post.created_utc * 1000),
      upvotes: post.ups,
      commentsCount: post.num_comments,
    }));
  }
}
