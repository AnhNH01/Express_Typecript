import { NextFunction, Request, Response } from "express";
import HttpExcetion from "../common/http-exception";

export const errorHandler = (
    err: HttpExcetion,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err.statusCode || err.status || 500;
    res.status(status).json({msg:err.message});
}