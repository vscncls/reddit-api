import { DatabasePoolType, sql } from "slonik";
import { PostgresConnectionPoolSingleton } from "./PostgresConnectionPoolSingleton";
import { PostOrdering } from "./PostOrdering";
import { Post } from "./Posts";

export class UsersProvider {
  private pool: DatabasePoolType;
  constructor() {
    this.pool = new PostgresConnectionPoolSingleton().getInstance();
  }

  public async getUsers(sortBy: PostOrdering): Promise<string[]> {
    const columnToSortBy = sortBy === "UPS" ? "upvotes" : "commentsCount";
    const result = await this.pool.connect(async (connection) => {
      return await connection.query<Post & { createdAt: number }>(sql`
        SELECT author
        FROM posts
        GROUP BY author
        ORDER BY SUM(${sql.identifier([columnToSortBy])}) DESC
      `);
    });

    return result.rows.map((postRow) => postRow.author);
  }
}
