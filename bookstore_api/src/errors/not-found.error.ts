import { StatusCodes } from "http-status-codes";
import HttpExcetion from "../common/http-exception";

export class NotFoundError extends HttpExcetion {
    constructor(message: string) {
        super(StatusCodes.NOT_FOUND, message);
    }
}