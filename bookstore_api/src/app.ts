// import cors from 'cors';
import console from "console";
import express, { Application, NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { dataSource } from "./app-data-source";
import { DevEnv } from "./environment/dev.env";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { authRouter } from "./routes/auth.route";
import { authorRouter } from "./routes/author.route";
import { genreRouter } from "./routes/genre.route";
import { publisherRouter } from "./routes/publisher.route";

const app: Application = express();
const PORT = Number(DevEnv.PORT);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(helmet);
// app.use(cors);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/author", authorRouter);
app.use("/api/v1/genre", genreRouter);
app.use("/api/v1/publisher", publisherRouter);

// init databse connection
dataSource
  .initialize()
  .then(() => console.log("Database connection initialized"))
  .catch((err: Error) => console.log(`Error connecting to database: ${err}`));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello");
});

app.use(notFoundHandler);
app.use(errorHandler);

// start the app
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
