import { fetchPosts } from "../redditApi";

describe("Fetch posts from reddit's API", () => {
  it("Returns all current hot posts", async () => {
    const posts = await fetchPosts("artificial");
    expect(posts).toBeTruthy();
    expect(posts.length).toBeGreaterThan(0);
    posts.forEach((post) => {
      expect(post.title).toBeTruthy();
      expect(typeof post.title).toBe("string");
      expect(post.author).toBeTruthy();
      expect(typeof post.author).toBe("string");
      expect(post.createdAt).toBeTruthy();
      expect(post.createdAt).toBeInstanceOf(Date);
      expect(typeof post.upvotes).toBe("number");
      expect(typeof post.commentsCount).toBe("number");
    });
  });
});
