import StatusCodes from "http-status-codes";
import HttpExcetion from "../common/http-exception";

export class InternalServerError extends HttpExcetion {
  constructor(message: string) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
}
