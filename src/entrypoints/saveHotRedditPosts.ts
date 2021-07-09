import { fetchPosts } from "../fetchPosts/redditApi";
import { savePosts } from "../fetchPosts/savePosts";
import dotenv from "dotenv";
import { LoggerSingleton } from "../logger";

dotenv.config();

const main = async (): Promise<void> => {
  const logger = new LoggerSingleton().getInstance();
  logger.info("Fetching data from artificial subreddit");
  const posts = await fetchPosts("artificial");
  logger.info("Saving posts in db");
  savePosts(posts);
  logger.info("Done!");
};

main();
