import express from "express";
import * as authorController from "../controllers/authorController";
import { authenticationMiddleware } from "../middleware/auth.middleware";

const { createAuthor, getAllAuthors, updateAuthor, deleteAuthor } =
  authorController;

export const authorRouter = express.Router();

authorRouter.post("/create", authenticationMiddleware, createAuthor);
authorRouter.get("/all", getAllAuthors);
authorRouter.put("/update/:id", authenticationMiddleware, updateAuthor);
authorRouter.delete("/delete/:id", authenticationMiddleware, deleteAuthor);
