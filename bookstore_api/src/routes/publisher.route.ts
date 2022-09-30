import express from "express";
import * as publisherController from "../controllers/publisherController";
import { authenticationMiddleware } from "../middleware/auth.middleware";

export const publisherRouter = express.Router();

const { createPublisher, updatePublisher, getAllPubliser, deletePublisher } =
  publisherController;

publisherRouter.post("/create", authenticationMiddleware, createPublisher);
publisherRouter.put("/update/:id", authenticationMiddleware, updatePublisher);
publisherRouter.get("/all", getAllPubliser);
publisherRouter.delete(
  "/delete/:id",
  authenticationMiddleware,
  deletePublisher
);
