import { RedditClient } from "../RedditClient";
import { PostsProvider } from "../PostsProvider";
import dotenv from "dotenv";
import { LoggerSingleton } from "../LoggerSingleton";

dotenv.config();

const main = async (): Promise<void> => {
  const logger = new LoggerSingleton().getInstance();

  const redditClient = new RedditClient();
  logger.info("Fetching data from artificial subreddit");
  const posts = await redditClient.fetchPosts("artificial");

  const postsProvider = new PostsProvider();
  logger.info("Saving posts in db");
  postsProvider.savePosts(posts);

  logger.info("Done!");
};

main();
