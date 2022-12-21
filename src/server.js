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

const server = express();

const port = 3001;

server.use(cors()); // Just to let FE communicate with BE successfully

server.use(express.json());

// ****************** ENDPOINTS *********************
server.use("/blogPosts", blogPostsRouter);

// ****************** ERROR HANDLERS ****************
server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(notFoundHandler); // 404
server.use(genericErrorHandler); // 500

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port:", port);
});
