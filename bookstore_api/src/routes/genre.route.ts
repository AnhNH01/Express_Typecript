import express from "express";
import * as genreController from "../controllers/genreController";
import { authenticationMiddleware } from "../middleware/auth.middleware";

export const genreRouter = express.Router();

const { createGenre, updateGenre, deleteGenre, getAllGenre } = genreController;

genreRouter.post("/create", authenticationMiddleware, createGenre);
genreRouter.put("/update/:id", authenticationMiddleware, updateGenre);
genreRouter.delete("/delete/:id", authenticationMiddleware, deleteGenre);
genreRouter.get("/all", getAllGenre);
