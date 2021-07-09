import { sql } from "slonik";
import { PostgresConnectionPoolSingleton } from "./db";
import { Post } from "./Posts";

export const savePosts = async (posts: Post[]): Promise<void> => {
  const pool = new PostgresConnectionPoolSingleton().getInstance();
  await pool.connect(async (connection) => {
    return await connection.query(sql`
      INSERT INTO posts (title, author, "createdAt", upvotes, "commentsCount")
      SELECT * FROM ${sql.unnest(
        posts.map((post) => [post.title, post.author, post.createdAt.toUTCString(), post.upvotes, post.commentsCount]),
        ["text", "text", "timestamp", "int4", "int4"]
      )}
     `);
  });
};
