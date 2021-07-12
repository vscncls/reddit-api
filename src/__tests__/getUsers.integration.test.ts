import { sql } from "slonik";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";
import { Post } from "../Posts";
import { PostsProvider } from "../PostsProvider";
import { UsersProvider } from "../UsersProvider";

describe("Fetches users from Postgres DB", () => {
  afterEach(async () => {
    const pool = new PostgresConnectionPoolSingleton().getInstance();
    await pool.connect(async (connection) => {
      await connection.query(sql`DELETE FROM posts`);
    });
  });

  it("Sorts by `UPS`", async () => {
    const posts: Post[] = [
      {
        title: "title 1",
        author: "author 1",
        upvotes: 3,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        commentsCount: 321,
      },
      {
        title: "title 2",
        author: "author 2",
        upvotes: 1,
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

    const usersProvider = new UsersProvider();
    const users = await usersProvider.getUsers("UPS");

    expect(users).toHaveLength(3);
    expect(users[0]).toEqual(posts[0].author);
    expect(users[1]).toEqual(posts[2].author);
    expect(users[2]).toEqual(posts[1].author);
  });

  it("Sorts by `COMMENTS`", async () => {
    const posts: Post[] = [
      {
        title: "title 1",
        author: "author 1",
        upvotes: 5,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        commentsCount: 3,
      },
      {
        title: "title 2",
        author: "author 2",
        upvotes: 5,
        createdAt: new Date("2021-02-02T00:00:00.001Z"),
        commentsCount: 1,
      },
      {
        title: "title 3",
        author: "author 3",
        upvotes: 5,
        createdAt: new Date("2021-03-03T00:00:00.001Z"),
        commentsCount: 2,
      },
    ];
    const postsProvider = new PostsProvider();
    await postsProvider.savePosts(posts);

    const usersProvider = new UsersProvider();
    const users = await usersProvider.getUsers("COMMENTS");

    expect(users).toHaveLength(3);
    expect(users[0]).toEqual(posts[0].author);
    expect(users[1]).toEqual(posts[2].author);
    expect(users[2]).toEqual(posts[1].author);
  });

  it("Adds up Upvotes from the same user", async () => {
    const posts: Post[] = [
      {
        title: "title 1",
        author: "author 1",
        upvotes: 5,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        commentsCount: 3,
      },
      {
        title: "title 2",
        author: "author 1",
        upvotes: 5,
        createdAt: new Date("2021-02-02T00:00:00.001Z"),
        commentsCount: 1,
      },
      {
        title: "title 3",
        author: "author 2",
        upvotes: 2,
        createdAt: new Date("2021-03-03T00:00:00.001Z"),
        commentsCount: 2,
      },
    ];
    const postsProvider = new PostsProvider();
    await postsProvider.savePosts(posts);

    const usersProvider = new UsersProvider();
    const users = await usersProvider.getUsers("UPS");

    expect(users).toHaveLength(2);
    expect(users[0]).toEqual(posts[0].author);
    expect(users[1]).toEqual(posts[2].author);
  });

  it("Adds up Comments from the same user", async () => {
    const posts: Post[] = [
      {
        title: "title 1",
        author: "author 1",
        upvotes: 5,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        commentsCount: 10,
      },
      {
        title: "title 2",
        author: "author 1",
        upvotes: 5,
        createdAt: new Date("2021-02-02T00:00:00.001Z"),
        commentsCount: 10,
      },
      {
        title: "title 3",
        author: "author 2",
        upvotes: 10,
        createdAt: new Date("2021-03-03T00:00:00.001Z"),
        commentsCount: 15,
      },
    ];
    const postsProvider = new PostsProvider();
    await postsProvider.savePosts(posts);

    const usersProvider = new UsersProvider();
    const users = await usersProvider.getUsers("UPS");

    expect(users).toHaveLength(2);
    expect(users[0]).toEqual(posts[0].author);
    expect(users[1]).toEqual(posts[2].author);
  });

  it("Groups users together", async () => {
    const posts: Post[] = [
      {
        title: "title 1",
        author: "author 1",
        upvotes: 5,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        commentsCount: 10,
      },
      {
        title: "title 2",
        author: "author 1",
        upvotes: 5,
        createdAt: new Date("2021-02-02T00:00:00.001Z"),
        commentsCount: 10,
      },
      {
        title: "title 3",
        author: "author 2",
        upvotes: 10,
        createdAt: new Date("2021-03-03T00:00:00.001Z"),
        commentsCount: 15,
      },
      {
        title: "title 34",
        author: "author 2",
        upvotes: 10,
        createdAt: new Date("2021-03-04T00:00:00.001Z"),
        commentsCount: 15,
      },
    ];
    const postsProvider = new PostsProvider();
    await postsProvider.savePosts(posts);

    const usersProvider = new UsersProvider();
    const users = await usersProvider.getUsers("UPS");

    expect(users).toHaveLength(2);
    expect(users[0]).toEqual(posts[2].author);
    expect(users[1]).toEqual(posts[0].author);
  });
});
