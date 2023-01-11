import express from "express";
import { dirname, join } from "path";
import { pipeline } from "stream";
import { fileURLToPath } from "url";
import { createGzip } from "zlib";
import { getPDFreadableStream } from "../../lib/pdf-tools.js";
import fs from "fs";

const filesRouter = express.Router();

filesRouter.get("/pdf", (req, res, next) => {
  const blogPostsJSONPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "../blogPosts/blogPosts.json"
  );
  console.log(
    "🚀 ~ file: index.js:17 ~ filesRouter.get ~ blogPostsJSONPath",
    blogPostsJSONPath
  );

  const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));

  const blogPostsArray = getBlogPosts();

  res.setHeader("Content-Disposition", "attachment; filename=test.pdf");

  const source = getPDFreadableStream(blogPostsArray);
  const destination = res;
  pipeline(source, destination, (err) => {
    if (err) console.log(err);
  });
});

export default filesRouter;
