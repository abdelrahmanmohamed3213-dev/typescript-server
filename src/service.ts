

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

const blogs: Blog[] = []
let nextId = 1;

export const resetBlogs = () => {
  // clear the backing storage and reset id counter
  blogs.length = 0;
  nextId = 1;
};

export const createBlog = (title: string, content: string, author: string): Blog => {
  const blog: Blog = {
    id: nextId++,
    title,
    content,
    author,
    createdAt: new Date(),
  };
  blogs.push(blog);
  return blog;
};

export const getAllBlogs = (): Blog[] => {
  return blogs;
};

export const getBlogById = (id: number): Blog | undefined => {
  return blogs.find((blog) => blog.id === id);
};

export const deleteBlog = (id: number): boolean => {
  const index = blogs.findIndex((blog) => blog.id === id);
  if (index > -1) {
    blogs.splice(index, 1);
    return true;
  }
  return false;
};

export const updateBlog = (
  id: number,
  updates: Partial<Omit<Blog, "id" | "createdAt">>
): Blog | undefined => {
  const blog = blogs.find((b) => b.id === id);
  if (blog) {
    Object.assign(blog, updates);
    return blog;
  }
  return undefined;
};