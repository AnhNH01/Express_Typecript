import { StatusCodes } from "http-status-codes";
import HttpExcetion from "../common/http-exception";

export class UnauthorizedError extends HttpExcetion {
    constructor(message: string) {
        super(StatusCodes.FORBIDDEN, message);
    }
}