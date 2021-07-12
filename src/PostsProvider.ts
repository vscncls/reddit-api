import { DatabasePoolType, sql } from "slonik";
import { PostgresConnectionPoolSingleton } from "./PostgresConnectionPoolSingleton";
import { Post } from "./Posts";
import { PostOrdering } from "./PostOrdering";

export type PostFilters = {
  startDate: Date;
  endDate: Date;
};

export class PostsProvider {
  private pool: DatabasePoolType;
  constructor() {
    this.pool = new PostgresConnectionPoolSingleton().getInstance();
  }

  public async getPosts(filter: PostFilters, sortBy: PostOrdering): Promise<Post[]> {
    const columnToSortBy = sortBy === "UPS" ? "upvotes" : "commentsCount";
    const result = await this.pool.connect(async (connection) => {
      return await connection.query<Post>(sql`
        SELECT *
        FROM posts
        WHERE "createdAt" BETWEEN ${filter.startDate.toISOString()} AND ${filter.endDate.toISOString()}
        ORDER BY ${sql.identifier([columnToSortBy])} DESC
      `);
    });

    return [...result.rows];
  }

  public async savePosts(posts: Post[]): Promise<void> {
    await this.pool.connect(async (connection) => {
      return await connection.query(sql`
        INSERT INTO posts (title, author, "createdAt", upvotes, "commentsCount")
        SELECT * FROM ${sql.unnest(
          posts.map((post) => [
            post.title,
            post.author,
            post.createdAt.toISOString(),
            post.upvotes,
            post.commentsCount,
          ]),
          ["text", "text", "timestamp", "int4", "int4"]
        )}
      `);
    });
  }
}
