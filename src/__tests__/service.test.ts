import { describe, it, expect, beforeEach } from "vitest";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
  resetBlogs,
} from "../service";

describe("Blog Service", () => {
  beforeEach(() => {
    // Clear blogs before each test
    resetBlogs();
  });

  describe("createBlog", () => {
    it("should create a new blog", () => {
      const blog = createBlog("Test Blog", "Test Content", "Test Author");

      expect(blog).toHaveProperty("id");
      expect(blog.title).toBe("Test Blog");
      expect(blog.content).toBe("Test Content");
      expect(blog.author).toBe("Test Author");
      expect(blog).toHaveProperty("createdAt");
    });

    it("should auto-increment blog IDs", () => {
      const blog1 = createBlog("Blog 1", "Content 1", "Author 1");
      const blog2 = createBlog("Blog 2", "Content 2", "Author 2");

      expect(blog2.id).toBe(blog1.id + 1);
    });

    it("should add blog to the array", () => {
      createBlog("Test Blog", "Test Content", "Test Author");
      const blogs = getAllBlogs();

      expect(blogs).toHaveLength(1);
    });
  });

  describe("getAllBlogs", () => {
    it("should return an empty array initially", () => {
      const blogs = getAllBlogs();
      expect(blogs).toEqual([]);
    });

    it("should return all created blogs", () => {
      createBlog("Blog 1", "Content 1", "Author 1");
      createBlog("Blog 2", "Content 2", "Author 2");
      const blogs = getAllBlogs();

      expect(blogs).toHaveLength(2);
    });
  });

  describe("getBlogById", () => {
    it("should return a blog by ID", () => {
      const created = createBlog("Test Blog", "Test Content", "Test Author");
      const blog = getBlogById(created.id);

      expect(blog).toBeDefined();
      expect(blog?.title).toBe("Test Blog");
    });

    it("should return undefined for non-existent ID", () => {
      const blog = getBlogById(999);
      expect(blog).toBeUndefined();
    });
  });

  describe("deleteBlog", () => {
    it("should delete a blog by ID", () => {
      const blog = createBlog("Test Blog", "Test Content", "Test Author");
      const success = deleteBlog(blog.id);

      expect(success).toBe(true);
      expect(getAllBlogs()).toHaveLength(0);
    });

    it("should return false for non-existent ID", () => {
      const success = deleteBlog(999);
      expect(success).toBe(false);
    });

    it("should not affect other blogs", () => {
      const blog1 = createBlog("Blog 1", "Content 1", "Author 1");
      const blog2 = createBlog("Blog 2", "Content 2", "Author 2");

      deleteBlog(blog1.id);
      const blogs = getAllBlogs();

      expect(blogs).toHaveLength(1);
      expect(blogs[0].id).toBe(blog2.id);
    });
  });

  describe("updateBlog", () => {
    it("should update blog title", () => {
      const blog = createBlog("Old Title", "Content", "Author");
      const updated = updateBlog(blog.id, { title: "New Title" });

      expect(updated?.title).toBe("New Title");
      expect(updated?.content).toBe("Content");
    });

    it("should update blog content", () => {
      const blog = createBlog("Title", "Old Content", "Author");
      const updated = updateBlog(blog.id, { content: "New Content" });

      expect(updated?.content).toBe("New Content");
      expect(updated?.title).toBe("Title");
    });

    it("should update blog author", () => {
      const blog = createBlog("Title", "Content", "Old Author");
      const updated = updateBlog(blog.id, { author: "New Author" });

      expect(updated?.author).toBe("New Author");
    });

    it("should return undefined for non-existent ID", () => {
      const updated = updateBlog(999, { title: "New Title" });
      expect(updated).toBeUndefined();
    });

    it("should not update ID or createdAt", () => {
      const blog = createBlog("Title", "Content", "Author");
      const originalId = blog.id;
      const originalDate = blog.createdAt;

      updateBlog(blog.id, { title: "New Title" });
      const updated = getBlogById(originalId);

      expect(updated?.id).toBe(originalId);
      expect(updated?.createdAt).toEqual(originalDate);
    });
  });
});
