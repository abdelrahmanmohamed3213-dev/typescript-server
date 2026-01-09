import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
} from "./service";

const app = express();
const port = process.env.PORT || 3200;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Blog Endpoints
app.get("/blogs", (req, res) => {
  const blogs = getAllBlogs();
  res.json(blogs);
});

app.post("/blogs", (req, res) => {
  const { title, content, author } = req.body;
  
  if (!title || !content || !author) {
    return res.status(400).json({ error: "Title, content, and author are required" });
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
  const blog = updateBlog(Number(req.params.id), { title, content, author });
  
  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }
  
  res.json(blog);
});

app.delete("/blogs/:id", (req, res) => {
  const success = deleteBlog(Number(req.params.id));
  
  if (!success) {
    return res.status(404).json({ error: "Blog not found" });
  }
  
  res.json({ message: "Blog deleted successfully" });
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
