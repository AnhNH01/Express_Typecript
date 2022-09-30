import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Genre } from "../entity/genre.entity";
import { BadRequestError } from "../errors/bad-request.error";
import { InternalServerError } from "../errors/internal-server.error";
import { NotFoundError } from "../errors/not-found.error";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const createGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, role } = req.body.user;
  if (!id || !role || role !== "admin")
    return next(new UnauthorizedError("Unauthorized"));

  let genreName = req.body.genreName;
  if (!genreName || genreName.length === 0)
    return next(new BadRequestError("Invalid genre name"));

  const genre = await Genre.findOneBy({
    name: genreName,
  });

  if (genre && genre.deleted === false)
    return next(new BadRequestError("Genre already exist."));
  if (genre && genre.deleted === true) {
    genre.deleted = false;
    await genre.save();
    return res.status(StatusCodes.CREATED).json({
      success: true,
      id: genre.id,
    });
  }

  const newGenre = Genre.create({
    name: genreName,
  });

  if (await newGenre.save()) {
    res.status(StatusCodes.CREATED).json({
      success: true,
      id: newGenre.id,
    });
  } else {
    return next(new InternalServerError("Something went wrong"));
  }
};

export const updateGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, role } = req.body.user;
  if (!id || !role || role !== "admin")
    return next(new UnauthorizedError("Unauthorized"));

  const genreId = Number(req.params.id) || -1;
  if (!genreId || genreId < 0) return next(new BadRequestError("Invalid Id"));

  const genreName = req.body.genreName;
  if (!genreName || genreName.length === 0)
    return next(new BadRequestError("Invalid Genre name."));

  let genre = await Genre.findOneBy({
    id: genreId,
    deleted: false,
  });
  if (!genre) return next(new NotFoundError("Genre not found"));

  genre.name = genreName;
  if (await genre.save()) {
    res.status(StatusCodes.OK).json({
      success: true,
      result: genre,
    });
  } else {
    return next(new InternalServerError("Something went wrong"));
  }
};

export const deleteGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, role } = req.body.user;
  if (!id || !role || role !== "admin")
    return next(new UnauthorizedError("Unauthorized"));

  const genreId = Number(req.params.id) || -1;
  if (!genreId || genreId < 0) return next(new BadRequestError("Invalid Id"));

  let genre = await Genre.findOneBy({
    id: genreId,
  });

  if (!genre) return next(new BadRequestError("Genre does not exist"));
  else if (genre.deleted === true) {
    return next(new BadRequestError("Genre is already deleted"));
  } else if (genre.deleted === false) {
    genre.deleted = true;
    if (await genre.save()) res.status(StatusCodes.NO_CONTENT).json({});
    else return next(new InternalServerError("Something went wrong"));
  }
};

export const getAllGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let page: number = Number(req.query.page) || 1;
  let pageSize: number = Number(req.query.pageSize) || 10;
  if (page < 0) page = 1;
  if (pageSize < 0) pageSize = 10;

  const genres = await Genre.findBy({
    deleted: false,
  });

  if (!genres)
    return next(new NotFoundError("Can't find what you are looking for"));

  const totalPage =
    Math.floor(genres.length / pageSize) +
    (genres.length % pageSize == 0 ? 0 : 1);
  if (page > totalPage) page = 1;

  const skip = (page - 1) * pageSize;
  let returnGenres = genres.slice(skip, skip + pageSize);

  res.status(StatusCodes.OK).json({
    success: true,
    result: {
      page: page,
      pageSize: pageSize,
      genres: returnGenres,
      totalPages: totalPage,
    },
  });
};
