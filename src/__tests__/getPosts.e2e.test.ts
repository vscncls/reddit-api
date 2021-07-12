import { sql } from "slonik";
import { fastifyServer, slashPostsParams } from "../fastifyServer";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";
import { PostsProvider } from "../PostsProvider";

describe("/posts", () => {
  afterEach(async () => {
    const pool = new PostgresConnectionPoolSingleton().getInstance();
    await pool.connect(async (connection) => {
      await connection.query(sql`DELETE FROM posts`);
    });
  });

  it("Returns users within specified time range", async () => {
    const postsProvider = new PostsProvider();
    await postsProvider.savePosts([
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
    ]);
    const response = await fastifyServer.inject({
      method: "GET",
      url: "/posts",
      query: {
        sortBy: "UPS",
        startDate: "2021-02-01",
        endDate: "2021-03-01",
      } as slashPostsParams,
    });

    const body = JSON.parse(response.body);

    expect(body).toHaveLength(1);
    expect(body[0]).toStrictEqual({
      author: "author 2",
      commentsCount: 323,
      createdAt: "2021-02-02T00:00:00.001Z",
      title: "title 2",
      upvotes: 133,
    });
  });

  it("Returns users sorted by `UPS`", async () => {
    const postsProvider = new PostsProvider();
    await postsProvider.savePosts([
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
    ]);
    const response = await fastifyServer.inject({
      method: "GET",
      url: "/posts",
      query: {
        sortBy: "UPS",
        startDate: "1970-02-01",
        endDate: "2222-03-01",
      } as slashPostsParams,
    });

    const body = JSON.parse(response.body);

    expect(body).toHaveLength(3);
    expect(body[0].title).toStrictEqual("title 2");
    expect(body[1].title).toStrictEqual("title 3");
    expect(body[2].title).toStrictEqual("title 1");
  });

  it("Returns users sorted by `COMMENTS`", async () => {
    const postsProvider = new PostsProvider();
    await postsProvider.savePosts([
      {
        title: "title 1",
        author: "author 1",
        upvotes: 10,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        commentsCount: 1,
      },
      {
        title: "title 2",
        author: "author 2",
        upvotes: 10,
        createdAt: new Date("2021-02-02T00:00:00.001Z"),
        commentsCount: 3,
      },
      {
        title: "title 3",
        author: "author 3",
        upvotes: 10,
        createdAt: new Date("2021-03-03T00:00:00.001Z"),
        commentsCount: 2,
      },
    ]);
    const response = await fastifyServer.inject({
      method: "GET",
      url: "/posts",
      query: {
        sortBy: "COMMENTS",
        startDate: "1970-02-01",
        endDate: "2222-03-01",
      } as slashPostsParams,
    });

    const body = JSON.parse(response.body);

    expect(body).toHaveLength(3);
    expect(body[0].title).toStrictEqual("title 2");
    expect(body[1].title).toStrictEqual("title 3");
    expect(body[2].title).toStrictEqual("title 1");
  });

  it("Make sure parameters are not nullish", async () => {
    const response = await fastifyServer.inject({
      method: "GET",
      url: "/posts",
      query: {} as slashPostsParams,
    });

    const body = JSON.parse(response.body);

    expect(body.message).toEqual("All params are required");
  });

  it("Validates sortBy type", async () => {
    const response = await fastifyServer.inject({
      method: "GET",
      url: "/posts",
      query: {
        sortBy: "invalid",
        startDate: "1970-02-01",
        endDate: "2222-03-01",
      } as slashPostsParams,
    });

    const body = JSON.parse(response.body);

    expect(body.message).toMatch("Invalid sort type, valid types are UPS,COMMENTS");
  });
});
