CREATE TABLE IF NOT EXISTS posts (
  "title" TEXT NOT NULL,
  "author" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "upvotes" INTEGER NOT NULL,
  "commentsCount" INTEGER NOT NULL
);
