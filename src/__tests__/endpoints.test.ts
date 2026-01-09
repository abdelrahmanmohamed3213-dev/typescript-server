import { describe, it, expect, beforeEach } from "vitest";
import express, { Express } from "express";
import request from "supertest";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  resetBlogs,
} from "../service";

// Create a test app
const createTestApp = (): Express => {
  const app = express();
  app.use(express.json());

  app.get("/blogs", (req, res) => {
    const blogs = getAllBlogs();
    res.json(blogs);
  });

  app.post("/blogs", (req, res) => {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res
        .status(400)
        .json({ error: "Title, content, and author are required" });
    }

    const blog = createBlog(title, content, author);
    res.status(201).json(blog);
  });

  app.get("/blogs/:id", (req, res) => {
    const blog = getBlogById(Number(req.params.id));

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(blog);
  });

  app.put("/blogs/:id", (req, res) => {
    const { title, content, author } = req.body;
    const blog = getBlogById(Number(req.params.id));

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (author) blog.author = author;

    res.json(blog);
  });

  app.delete("/blogs/:id", (req, res) => {
    const success = deleteBlog(Number(req.params.id));

    if (!success) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  });

  return app;
};

describe("Blog API Endpoints", () => {
  let app: Express;

  beforeEach(() => {
    app = createTestApp();
    // Clear blogs before each test
    resetBlogs();
  });

  describe("GET /blogs", () => {
    it("should return an empty array initially", async () => {
      const res = await request(app).get("/blogs");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return all blogs", async () => {
      createBlog("Blog 1", "Content 1", "Author 1");
      createBlog("Blog 2", "Content 2", "Author 2");

      const res = await request(app).get("/blogs");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe("POST /blogs", () => {
    it("should create a new blog", async () => {
      const res = await request(app).post("/blogs").send({
        title: "New Blog",
        content: "Blog Content",
        author: "John Doe",
      });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe("New Blog");
      expect(res.body.content).toBe("Blog Content");
      expect(res.body.author).toBe("John Doe");
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("createdAt");
    });

    it("should return 400 if title is missing", async () => {
      const res = await request(app).post("/blogs").send({
        content: "Blog Content",
        author: "John Doe",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return 400 if content is missing", async () => {
      const res = await request(app).post("/blogs").send({
        title: "Blog Title",
        author: "John Doe",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return 400 if author is missing", async () => {
      const res = await request(app).post("/blogs").send({
        title: "Blog Title",
        content: "Blog Content",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe("GET /blogs/:id", () => {
    it("should return a blog by ID", async () => {
      const blog = createBlog("Test Blog", "Content", "Author");

      const res = await request(app).get(`/blogs/${blog.id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(blog.id);
      expect(res.body.title).toBe("Test Blog");
    });

    it("should return 404 for non-existent blog", async () => {
      const res = await request(app).get("/blogs/999");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Blog not found");
    });
  });

  describe("PUT /blogs/:id", () => {
    it("should update a blog", async () => {
      const blog = createBlog("Old Title", "Old Content", "Old Author");

      const res = await request(app).put(`/blogs/${blog.id}`).send({
        title: "New Title",
        content: "New Content",
        author: "New Author",
      });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("New Title");
      expect(res.body.content).toBe("New Content");
      expect(res.body.author).toBe("New Author");
    });

    it("should return 404 for non-existent blog", async () => {
      const res = await request(app).put("/blogs/999").send({
        title: "New Title",
      });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Blog not found");
    });
  });

  describe("DELETE /blogs/:id", () => {
    it("should delete a blog", async () => {
      const blog = createBlog("Test Blog", "Content", "Author");

      const res = await request(app).delete(`/blogs/${blog.id}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Blog deleted successfully");

      // Verify blog is deleted
      const getRes = await request(app).get(`/blogs/${blog.id}`);
      expect(getRes.status).toBe(404);
    });

    it("should return 404 for non-existent blog", async () => {
      const res = await request(app).delete("/blogs/999");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Blog not found");
    });
  });
});
