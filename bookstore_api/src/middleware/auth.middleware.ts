import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "../common/jwt-payload";
import { DevEnv } from "../environment/dev.env";
import { UnauthenticatedError } from "../errors/unauthenticated.error";

export const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return next(new UnauthenticatedError("No access token provided"));

  const accessToken = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(accessToken, DevEnv.JWT_SECRET as string);
    const { id, role } = decodedToken as JwtPayload;
    if (!role) throw new UnauthenticatedError("Invalid token");

    if (role === "customer") {
      req.body.user = {
        id: id,
        role: "customer",
      };
    }
    if (role === "admin") {
      req.body.user = {
        id: id,
        role: "admin",
      };
    }
    next();
  } catch (error) {
    next(error);
  }
};
