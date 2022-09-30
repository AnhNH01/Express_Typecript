import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Publisher } from "../entity/publisher.entity";
import { BadRequestError } from "../errors/bad-request.error";
import { InternalServerError } from "../errors/internal-server.error";
import { NotFoundError } from "../errors/not-found.error";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const createPublisher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, role } = req.body.user;
  if (!id || !role || role !== "admin")
    return next(new UnauthorizedError("Unauthorized"));

  const publisherName = req.body.publisherName;
  if (!publisherName || publisherName.length === 0)
    return next(new BadRequestError("Invalid publisher name"));

  const publisher = await Publisher.findOneBy({
    name: publisherName,
  });

  if (publisher && publisher.deleted === false)
    return next(new BadRequestError("Publisher already exist."));
  if (publisher && publisher.deleted === true) {
    publisher.deleted = false;
    if (await publisher.save())
      return res.status(StatusCodes.CREATED).json({
        success: true,
        id: publisher.id,
      });
    else return next(new InternalServerError("Something went wrong"));
  }

  const newPublisher = Publisher.create({
    name: publisherName,
  });

  if (await newPublisher.save()) {
    res.status(StatusCodes.CREATED).json({
      success: true,
      id: newPublisher.id,
    });
  } else {
    next(new InternalServerError("Something went wrong"));
  }
};

export const updatePublisher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, role } = req.body.user;
  if (!id || !role || role !== "admin")
    return next(new UnauthorizedError("Unauthorized"));

  const publisherId = Number(req.params.id) || -1;
  if (!publisherId || publisherId < 0)
    return next(new BadRequestError("Invalid id."));

  const publisherName: string = req.body.publisherName;
  if (!publisherName || publisherName.length === 0)
    return next(new BadRequestError("Invalid publisher name"));

  const publisher = await Publisher.findOneBy({
    id: publisherId,
    deleted: false,
  });

  if (!publisher)
    return next(new NotFoundError("Can't find what you are looking for."));

  publisher.name = publisherName;
  if (await publisher.save())
    res.status(StatusCodes.OK).json({
      success: true,
      result: publisher,
    });
  else next(new InternalServerError("Something went wrong"));
};

export const deletePublisher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, role } = req.body.user;
  if (!id || !role || role !== "admin")
    return next(new UnauthorizedError("Unauthorized"));

  const publisherId = Number(req.params.id) || -1;
  if (!publisherId || publisherId < 0)
    return next(new BadRequestError("Invalid id."));

  const publisher = await Publisher.findOneBy({
    id: publisherId,
  });

  if (!publisher || (publisher && publisher.deleted === true))
    return next(new BadRequestError("Publisher does not exist or is deleted"));

  if (publisher && publisher.deleted === false) {
    publisher.deleted = true;
    if (await publisher.save()) {
      res.status(StatusCodes.NO_CONTENT).json({});
    } else next(new InternalServerError("Something went wrong"));
  }
};

export const getAllPubliser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let page: number = Number(req.query.page) || 1;
  let pageSize: number = Number(req.query.pageSize) || 10;
  if (page < 0) page = 1;
  if (pageSize < 0) pageSize = 10;

  const publishers = await Publisher.findBy({
    deleted: false,
  });

  if (!publishers)
    return next(new NotFoundError("Can't find what you are looking for"));

  const totalPage =
    Math.floor(publishers.length / pageSize) +
    (publishers.length % pageSize == 0 ? 0 : 1);
  if (page > totalPage) page = 1;

  let skip = (page - 1) * pageSize;
  const returnPublisher = publishers.slice(skip, skip + pageSize);

  res.status(StatusCodes.OK).json({
    success: true,
    result: {
      page: page,
      pageSize: pageSize,
      genres: returnPublisher,
      totalPages: totalPage,
    },
  });
};
