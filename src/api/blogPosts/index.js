import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import fs from "fs";
import httpErrors from "http-errors";
import { checksPostSchema, triggerBadRequest } from "./validator.js";

const { NotFound } = httpErrors;

const blogPostsRouter = express.Router();

const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));
const writeBlogPosts = (blogPostsArray) =>
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray));

// *****************POST******************

blogPostsRouter.post(
  "/",
  checksPostSchema,
  triggerBadRequest,
  (req, res, next) => {
    try {
      req.body.author.avatar = `https://ui-avatars.com/api/?name=${req.body.author.name}`;
      const newBlogPost = {
        ...req.body,
        // author: {
        //   ...req.body.author,
        //   avatar: `https://ui-avatars.com/api/?name=${req.body.author.name}`, //! way 2
        // },
        createdAt: new Date(),
        id: uniqid(),
      };
      // newBlogPost.author.avatar = `https://ui-avatars.com/api/?name=${req.body.author.name}`; //! way 3

      const blogPostsArray = getBlogPosts();

      blogPostsArray.push(newBlogPost);

      writeBlogPosts(blogPostsArray);

      res.status(201).send({ id: newBlogPost.id });
    } catch (error) {
      next(error);
    }
  }
);

// *****************GET LIST******************

blogPostsRouter.get("/", (req, res, next) => {
  try {
    const blogPostsArray = getBlogPosts();
    if (req.query && req.query.category) {
      const filteredBlogPosts = blogPostsArray.filter(
        (blogPost) => blogPost.category === req.query.category
      );
      res.send(filteredBlogPosts);
    } else {
      res.send(blogPostsArray);
    }
  } catch (error) {
    next(error);
  }
});

// *****************GET by ID******************

blogPostsRouter.get("/:blogPostId", (req, res, next) => {
  try {
    const blogPosts = getBlogPosts();
    const blogPost = blogPosts.find(
      (blogPost) => blogPost.id === req.params.blogPostId
    );
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(NotFound(`BlogPost with id ${req.params.blogPostId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// *****************EDIT******************

blogPostsRouter.put("/:blogPostId", (req, res, next) => {
  try {
    const blogPosts = getBlogPosts();

    const index = blogPosts.findIndex(
      (blogPost) => blogPost.id === req.params.blogPostId
    );
    if (index !== -1) {
      const oldBlogPost = blogPosts[index];

      const updatedBlogPost = {
        ...oldBlogPost,
        ...req.body,
        updatedAt: new Date(),
      };

      blogPosts[index] = updatedBlogPost;

      writeBlogPosts(blogPosts);
      res.send(updatedBlogPost);
    } else {
      next(NotFound(`BlogPost with id ${req.params.blogPostId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// *****************DELETE******************

blogPostsRouter.delete("/:blogPostId", (req, res, next) => {
  try {
    const blogPosts = getBlogPosts();

    const remainingBlogPosts = blogPosts.filter(
      (blogPost) => blogPost.id !== req.params.blogPostId
    );

    if (blogPosts.length !== remainingBlogPosts.length) {
      writeBlogPosts(remainingBlogPosts);
      res.status(204).send();
    } else {
      next(NotFound(`BlogPost with id ${req.params.blogPostId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;
