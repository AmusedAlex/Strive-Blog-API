import express from "express";
import { dirname, join } from "path";
import { pipeline } from "stream";
import { fileURLToPath } from "url";
import { createGzip } from "zlib";
import { getPDFreadableStream } from "../../lib/pdf-tools.js";
import fs from "fs";

const filesRouter = express.Router();
const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../blogPosts/blogPosts.json"
);
const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));

filesRouter.get("/pdf", (req, res, next) => {
  const blogPostsArray = getBlogPosts();

  res.setHeader("Content-Disposition", "attachment; filename=blogPosts.pdf");

  const source = getPDFreadableStream(blogPostsArray);
  const destination = res;
  pipeline(source, destination, (err) => {
    if (err) console.log(err);
  });
});

filesRouter.get("/pdf/:blogPostId", (req, res, next) => {
  const blogPosts = getBlogPosts();

  const blogPost = blogPosts.find(
    (blogPost) => blogPost.id === req.params.blogPostId
  );

  const blogPostsArray = [];

  blogPostsArray.push(blogPost);

  res.setHeader("Content-Disposition", "attachment; filename=blogPosts.pdf");

  const source = getPDFreadableStream(blogPostsArray);
  const destination = res;
  pipeline(source, destination, (err) => {
    if (err) console.log(err);
  });
});

export default filesRouter;
