import { sql } from "slonik";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";
import { Post } from "../Posts";
import { PostsProvider } from "../PostsProvider";

describe("Fetches posts from Postgres DB", () => {
  afterEach(async () => {
    const pool = new PostgresConnectionPoolSingleton().getInstance();
    await pool.connect(async (connection) => {
      await connection.query(sql`DELETE FROM posts`);
    });
  });

  it("Only fetches posts within the specified time range", async () => {
    const posts: Post[] = [
      {
        title: "title 1",
        author: "author 1",
        upvotes: 132,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        commentsCount: 321,
      },
      {
        title: "title 2",
        author: "author 2",
        upvotes: 133,
        createdAt: new Date("2021-02-02T00:00:00.001Z"),
        commentsCount: 323,
      },
      {
        title: "title 3",
        author: "author 3",
        upvotes: 133,
        createdAt: new Date("2021-03-03T00:00:00.001Z"),
        commentsCount: 323,
      },
    ];
    const postsProvider = new PostsProvider();
    await postsProvider.savePosts(posts);

    const savedPosts = await postsProvider.getPosts(
      { startDate: new Date("2021-02-01T00:00:00.001Z"), endDate: new Date("2021-03-01T00:00:00.001Z") },
      "UPS"
    );

    expect(savedPosts).toHaveLength(1);
    expect(savedPosts[0]).toStrictEqual(posts[1]);
  });

  it("Sorts by `UPS`", async () => {
    const posts: Post[] = [
      {
        title: "title 1",
        author: "author 1",
        upvotes: 1,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        commentsCount: 321,
      },
      {
        title: "title 2",
        author: "author 2",
        upvotes: 3,
        createdAt: new Date("2021-02-02T00:00:00.001Z"),
        commentsCount: 323,
      },
      {
        title: "title 3",
        author: "author 3",
        upvotes: 2,
        createdAt: new Date("2021-03-03T00:00:00.001Z"),
        commentsCount: 323,
      },
    ];
    const postsProvider = new PostsProvider();
    await postsProvider.savePosts(posts);

    const savedPosts = await postsProvider.getPosts(
      { startDate: new Date("1970-02-01T00:00:00.001Z"), endDate: new Date("2222-03-01T00:00:00.001Z") },
      "UPS"
    );

    expect(savedPosts[0]).toStrictEqual(posts[1]);
    expect(savedPosts[1]).toStrictEqual(posts[2]);
    expect(savedPosts[2]).toStrictEqual(posts[0]);
  });

  it("Sorts by `COMMENTS`", async () => {
    const posts: Post[] = [
      {
        title: "title 1",
        author: "author 1",
        upvotes: 2,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        commentsCount: 1,
      },
      {
        title: "title 2",
        author: "author 2",
        upvotes: 2,
        createdAt: new Date("2021-02-02T00:00:00.001Z"),
        commentsCount: 3,
      },
      {
        title: "title 3",
        author: "author 3",
        upvotes: 2,
        createdAt: new Date("2021-03-03T00:00:00.001Z"),
        commentsCount: 2,
      },
    ];
    const postsProvider = new PostsProvider();
    await postsProvider.savePosts(posts);

    const savedPosts = await postsProvider.getPosts(
      { startDate: new Date("1970-02-01T00:00:00.001Z"), endDate: new Date("2222-03-01T00:00:00.001Z") },
      "COMMENTS"
    );

    expect(savedPosts[0]).toStrictEqual(posts[1]);
    expect(savedPosts[1]).toStrictEqual(posts[2]);
    expect(savedPosts[2]).toStrictEqual(posts[0]);
  });
});
