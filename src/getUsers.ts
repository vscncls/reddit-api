import { sql } from "slonik";
import { PostgresConnectionPoolSingleton } from "./db";
import { PostDb } from "./PostDb";
import { PostOrdering } from "./PostOrdering";

export const getUsers = async (sortBy: PostOrdering): Promise<string[]> => {
  const pool = new PostgresConnectionPoolSingleton().getInstance();
  const columnToSortBy = sortBy === "UPS" ? "upvotes" : "commentsCount";
  const result = await pool.connect(async (connection) => {
    return await connection.query<PostDb>(sql`
      SELECT author
      FROM posts
      GROUP BY author
      ORDER BY SUM(${sql.identifier([columnToSortBy])}) DESC
    `);
  });

  return result.rows.map((postRow) => postRow.author);
};
