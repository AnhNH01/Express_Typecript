import StatusCodes from 'http-status-codes';
import HttpExcetion from '../common/http-exception';

export class BadRequestError extends HttpExcetion {
    constructor(message: string) {
        super(StatusCodes.BAD_REQUEST, message);
    }
}
