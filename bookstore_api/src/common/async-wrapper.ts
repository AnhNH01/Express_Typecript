import { NextFunction, Request, Response } from "express";

// async wrapper so you dont have to manually call next(err) in every func, just throw new error.


const wrapper = (func: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await func(req, res, next);
        } catch (error) {
            next(error);            
        }
    }
}

export default wrapper;