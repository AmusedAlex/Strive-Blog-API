import express from "express";
import fs from "fs";
import { dirname, join } from "path";
import uniqid from "uniqid";
import { fileURLToPath } from "url";

const authorsRouter = express.Router();

console.log("CURRENT FILE URL: ", import.meta.url);
console.log("CURRENT FILE PATH: ", fileURLToPath(import.meta.url));

console.log("PARENT FOLDER: ", dirname(fileURLToPath(import.meta.url)));

console.log(
  "TARGET FILE",
  join(dirname(fileURLToPath(import.meta.url)), `authors.json`)
);

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  `authors.json`
);

// POST AUTHOR

authorsRouter.post("/", (req, res) => {
  // console.log("REQ BODY: ", req.body);

  if (
    req.body.email !== undefined && //checking if email, name, surname was sent
    req.body.name !== undefined &&
    req.body.surname !== undefined
  ) {
    const email = req.body.email;
    const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

    const authorWithSameEmail = authorsArray.find(
      (author) => author.email === email
    );

    if (authorWithSameEmail === undefined) {
      const newAuthor = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
        id: uniqid(),
      };

      authorsArray.push(newAuthor);

      fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

      res.status(201).send({ newAuthor });
    } else {
      res.status(400).send(email + " already exists.");
    }
  } else {
    res.status(400).send("authors need at least name, surname and email.");
  }
});

// GET authors list

authorsRouter.get("/", (req, res) => {
  const fileContentAsABuffer = fs.readFileSync(authorsJSONPath);
  const authorsArray = JSON.parse(fileContentAsABuffer);
  // console.log(authorsArray);
  res.send(authorsArray);
});

// GET author by ID

authorsRouter.get("/:authorId", (req, res) => {
  const authorId = req.params.authorId;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const author = authorsArray.find((author) => author.id === authorId);

  console.log("author: ", author);

  if (author !== undefined) {
    res.send(author);
  } else {
    res.status(400).send("Author not found in the list");
  }
});

// EDIT author by ID

authorsRouter.put("/:authorId", (req, res) => {
  const authorId = req.params.authorId;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const index = authorsArray.findIndex((author) => author.id === authorId);

  if (index >= 0) {
    const oldAuthor = authorsArray[index];
    const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
    authorsArray[index] = updatedAuthor;

    fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
    res.send(updatedAuthor);
  } else {
    res.status(400).send("Author with that ID is not available");
  }
});

// DELETE Author by ID

authorsRouter.delete("/:authorId", (req, res) => {
  const authorId = req.params.authorId;
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const author = authorsArray.find((author) => author.id === authorId);

  if (author !== undefined) {
    const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

    const remainingAuthors = authorsArray.filter(
      (author) => author.id !== authorId
    );

    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));

    res.send("Author deleted");
  } else {
    res.status(400).send("Author with that ID is not available");
  }
});

export default authorsRouter;
