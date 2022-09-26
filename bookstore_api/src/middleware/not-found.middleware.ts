import { NextFunction, Request, Response } from "express";

export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const message = `Not found resource.`;
    res.status(404).send(message);
}