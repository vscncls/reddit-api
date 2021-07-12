import { sql } from "slonik";
import { fastifyServer } from "../fastifyServer";
import { PostgresConnectionPoolSingleton } from "../PostgresConnectionPoolSingleton";
import { PostsProvider } from "../PostsProvider";

describe("/users", () => {
  afterEach(async () => {
    const pool = new PostgresConnectionPoolSingleton().getInstance();
    await pool.connect(async (connection) => {
      await connection.query(sql`DELETE FROM posts`);
    });
  });

  it("Returns users sorted by Upvotes", async () => {
    const postsProvider = new PostsProvider();
    await postsProvider.savePosts([
      {
        title: "title 1",
        author: "author 1",
        upvotes: 20,
        createdAt: new Date("2021-01-01T00:00:00.000Z"),
        commentsCount: 10,
      },
      {
        title: "title 2",
        author: "author 1",
        upvotes: 20,
        createdAt: new Date("2021-02-02T00:00:00.001Z"),
        commentsCount: 10,
      },
      {
        title: "title 3",
        author: "author 2",
        upvotes: 30,
        createdAt: new Date("2021-03-03T00:00:00.001Z"),
        commentsCount: 15,
      },
      {
        title: "title 34",
        author: "author 2",
        upvotes: 30,
        createdAt: new Date("2021-03-04T00:00:00.001Z"),
        commentsCount: 15,
      },
    ]);
    const response = await fastifyServer.inject({
      method: "GET",
      url: "/users",
      query: { sortBy: "UPS" },
    });

    const body: string[] = JSON.parse(response.body);

    expect(body).toHaveLength(2);
    expect(body[0]).toEqual("author 2");
    expect(body[1]).toEqual("author 1");
  });

  it("Returns users sorted by Comments", async () => {
    const postsProvider = new PostsProvider();
    await postsProvider.savePosts([
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
    ]);
    const response = await fastifyServer.inject({
      method: "GET",
      url: "/users",
      query: { sortBy: "COMMENTS" },
    });

    const body: string[] = JSON.parse(response.body);

    expect(body).toHaveLength(2);
    expect(body[0]).toEqual("author 2");
    expect(body[1]).toEqual("author 1");
  });

  it("Validates sortBy", async () => {
    const response = await fastifyServer.inject({
      method: "GET",
      url: "/users",
      query: { sortBy: "invalid" },
    });

    const body = JSON.parse(response.body);

    expect(response.statusCode).toEqual(400);
    expect(body.message).toMatch('querystring.sortBy should match pattern "^(UPS|COMMENTS)$"');
  });
});
