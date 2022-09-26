import { StatusCodes } from "http-status-codes";
import HttpExcetion from "../common/http-exception";

export class UnauthenticatedError extends HttpExcetion {
    constructor(message: string) {
        super(StatusCodes.UNAUTHORIZED, message);
    }
}