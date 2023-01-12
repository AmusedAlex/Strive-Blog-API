import express from "express";
import { dirname, join } from "path";
import { pipeline } from "stream";
import { fileURLToPath } from "url";
import { createGzip } from "zlib";
import {
  getBlogPostsJsonReadableStream,
  getPDFreadableStream,
} from "../../lib/pdf-tools.js";
import fs from "fs";
import json2csv from "json2csv";

const filesRouter = express.Router();

const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../api/blogPosts/blogPosts.json"
);

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));

filesRouter.get("/blogPostsPDF", (req, res, next) => {
  const blogPostsArray = getBlogPosts();

  res.setHeader("Content-Disposition", "attachment; filename=blogPosts.pdf");

  const source = getPDFreadableStream(blogPostsArray);
  const destination = res;
  pipeline(source, destination, (err) => {
    if (err) console.log(err);
  });
});

filesRouter.get("/blogPostPDF/:blogPostId", (req, res, next) => {
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

filesRouter.get("/blogPostsCSV", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=blogPosts.csv");
    const source = getBlogPostsJsonReadableStream();
    const transform = new json2csv.Transform({
      fields: ["title", "category", "id"],
    });
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
