import { describe, expect, it } from "vitest";
import { BLOG_POSTS, postsByNewest, relatedPosts } from "./blog-posts";

describe("BLOG_POSTS", () => {
  it("every path starts with a single leading slash", () => {
    for (const post of BLOG_POSTS) {
      expect(post.path.startsWith("/")).toBe(true);
      expect(post.path.startsWith("//")).toBe(false);
    }
  });

  it("has unique slugs and paths", () => {
    const slugs = BLOG_POSTS.map((p) => p.slug);
    const paths = BLOG_POSTS.map((p) => p.path);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("every post has the required fields filled in", () => {
    for (const post of BLOG_POSTS) {
      expect(post.title.trim().length).toBeGreaterThan(0);
      expect(post.description.trim().length).toBeGreaterThan(0);
      expect(post.category.length).toBeGreaterThan(0);
      expect(post.keywords.length).toBeGreaterThan(0);
      // ISO date shape: YYYY-MM-DD
      expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("postsByNewest", () => {
  it("returns posts sorted by publishedAt descending", () => {
    const sorted = postsByNewest();
    expect(sorted.length).toBe(BLOG_POSTS.length);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].publishedAt.localeCompare(sorted[i].publishedAt)).toBeGreaterThanOrEqual(0);
    }
  });

  it("does not mutate the source array", () => {
    const before = BLOG_POSTS.map((p) => p.slug);
    postsByNewest();
    expect(BLOG_POSTS.map((p) => p.slug)).toEqual(before);
  });
});

describe("relatedPosts", () => {
  it("excludes the current post", () => {
    const current = BLOG_POSTS[0].slug;
    const related = relatedPosts(current);
    expect(related.every((p) => p.slug !== current)).toBe(true);
  });

  it("returns at most n posts", () => {
    const current = BLOG_POSTS[0].slug;
    expect(relatedPosts(current, 3).length).toBeLessThanOrEqual(3);
  });
});
