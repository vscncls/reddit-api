import { sql } from "slonik";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";
import { Post } from "../Posts";
import { PostsProvider } from "../PostsProvider";

it("Saves posts in Postgres DB", async () => {
  const posts: Post[] = [
    {
      title: "title 1",
      author: "author 1",
      upvotes: 132,
      createdAt: new Date("2021-01-01"),
      commentsCount: 321,
    },
    {
      title: "title 2",
      author: "author 2",
      upvotes: 133,
      createdAt: new Date("2021-02-02"),
      commentsCount: 323,
    },
  ];
  const postsProvider = new PostsProvider();

  await postsProvider.savePosts(posts);

  const pool = new PostgresConnectionPoolSingleton().getInstance();
  const savedPosts = await pool.connect(async (connection) => {
    return await connection.query<Post>(sql`
      SELECT title, author, "createdAt", upvotes, "commentsCount"
      FROM posts
   `);
  });

  expect(savedPosts.rows.length).toBe(2);
  expect(savedPosts.rows).toStrictEqual(posts);

  await pool.connect(async (connection) => {
    await connection.query(sql`DELETE FROM posts`);
  });
});
