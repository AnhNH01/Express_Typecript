import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Author } from "../entity/author.entity";
import { BadRequestError } from "../errors/bad-request.error";
import { InternalServerError } from "../errors/internal-server.error";
import { NotFoundError } from "../errors/not-found.error";

export const getAllAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let page: number = Number(req.query.page) || 1;
  let pageSize: number = Number(req.query.pageSize) || 10;
  if (page < 0) page = 1;
  if (pageSize < 0) pageSize = 10;

  const authors = await Author.findBy({
    deleted: false,
  });

  if (!authors)
    return next(new NotFoundError("Can find what you are looking for."));

  const totalPage =
    Math.floor(authors.length / pageSize) +
    (authors.length % pageSize == 0 ? 0 : 1);
  if (page > totalPage) page = 1;

  const skip = (page - 1) * pageSize;
  let returnAuthor = authors.slice(skip, skip + pageSize);

  res.status(StatusCodes.OK).json({
    success: true,
    result: {
      page: page,
      pageSize: pageSize,
      authors: returnAuthor,
      totalPages: authors.length,
    },
  });
};

export const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, role } = req.body.user;
  if (!id || !role || role !== "admin")
    return next(new BadRequestError("Unauthorized"));

  const authorName = req.body.authorName;
  if (!authorName || authorName.length === 0)
    return next(new BadRequestError("Invalid author name"));

  let author = await Author.findOneBy({
    name: authorName,
  });

  if (author && author.deleted === true) {
    author.deleted = false;
    await author.save();
    return res.status(StatusCodes.OK).json({
      success: true,
      id: author.id,
    });
  }

  if (author && author.deleted === false)
    return next(new BadRequestError("Author already exist"));

  const newAuthor = Author.create({
    name: authorName,
  });

  await newAuthor.save();
  if (newAuthor.hasId()) {
    res.status(StatusCodes.CREATED).json({
      success: true,
      id: newAuthor.id,
    });
  } else return next(new InternalServerError("Something went wrong."));
};

export const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, role } = req.body.user;
  if (!id || !role || role !== "admin")
    return next(new BadRequestError("Unauthorized"));

  let authorId: number = Number(req.params.id) || -1;
  if (!authorId || authorId < 0) return next(new BadRequestError("Invalid id"));

  const author = await Author.findOneBy({
    id: authorId,
    deleted: false,
  });

  if (!author) return next(new NotFoundError("Author not found"));
  const newName = req.body.authorName;
  if (!newName || newName.length === 0)
    return next(new BadRequestError("Invalid name"));

  author.name = newName;
  if (await author.save()) {
    res.status(StatusCodes.OK).json({
      success: true,
      result: author,
    });
  } else {
    return next(new InternalServerError("Something went wrong"));
  }
};

export const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, role } = req.body.user;
  if (!id || !role || role !== "admin")
    return next(new BadRequestError("Unauthorized"));

  let authorId: number = Number(req.params.id) || -1;
  if (!authorId || authorId === -1)
    return next(new BadRequestError("Invalid id"));

  const author = await Author.findOneBy({
    id: authorId,
  });

  if (!author) return next(new BadRequestError("Author does not exist."));
  else if (author.deleted === false) {
    author.deleted = true;
    await author.save();
    res.status(StatusCodes.NO_CONTENT).json({});
  } else {
    return next(new BadRequestError("Author is already deleted"));
  }
};
