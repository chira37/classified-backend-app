import { httpResponse } from "../utils/constants";
class APIError extends Error {
    readonly name: string;
    readonly httpCode: number;

    constructor(message = "Server error", name = "SERVER_ERROR", httpCode = httpResponse.SERVER_ERROR) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.httpCode = httpCode;
        Error.captureStackTrace(this);
    }
}
export default APIError;
