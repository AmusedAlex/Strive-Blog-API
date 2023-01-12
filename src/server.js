import express from "express"; // NEW IMPORT SYNTAX (do not forget to add type: "module" to package.json to use this!!)
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import blogPostsRouter from "./api/blogPosts/index.js";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";
import filesRouter from "./api/files/index.js";

// import dotenv from "dotenv";
// dotenv.config();

// !OR in package.json =
// "scripts": {
//   "dev": "nodemon -r dotenv/config -e js ./src/server.js"
// },

const server = express();

const port = 3001;

server.use(cors()); // Just to let FE communicate with BE successfully

server.use(express.json());

// ****************** ENDPOINTS *********************
server.use("/blogPosts", blogPostsRouter);
server.use("/download", filesRouter);

// ****************** ERROR HANDLERS ****************
server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(notFoundHandler); // 404
server.use(genericErrorHandler); // 500

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port:", port);
});
