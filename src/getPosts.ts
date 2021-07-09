import { sql } from "slonik";
import { PostgresConnectionPoolSingleton } from "./db";
import { Post } from "./fetchPosts/Posts";
import { PostDb } from "./PostDb";
import { PostOrdering } from "./PostOrdering";

export type PostFilters = {
  startDate: Date;
  endDate: Date;
};

export const getPosts = async (filter: PostFilters, sortBy: PostOrdering): Promise<Post[]> => {
  const pool = new PostgresConnectionPoolSingleton().getInstance();
  const columnToSortBy = sortBy === "UPS" ? "upvotes" : "commentsCount";
  const result = await pool.connect(async (connection) => {
    return await connection.query<PostDb>(sql`
      SELECT *
      FROM posts
      WHERE "createdAt" BETWEEN ${filter.startDate.toISOString()} AND ${filter.endDate.toISOString()}
      ORDER BY ${sql.identifier([columnToSortBy])} DESC
    `);
  });

  return result.rows.map((postRow) => ({
    ...postRow,
    createdAt: new Date(postRow.createdAt),
  }));
};
