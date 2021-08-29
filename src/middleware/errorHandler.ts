/* eslint-disable @typescript-eslint/no-unused-vars */
import APIError from "../helpers/APIError";
import { NextFunction, Request, Response } from "express";
import { ErrorType } from "../types";
import { httpResponse } from "../utils/constants";

const errorHandler = (err: ErrorType, _req: Request, res: Response, _next: NextFunction): void => {
    console.log(err);
    if (err instanceof APIError) {
        res.status(err.httpCode);
        res.json({ success: false, message: err.message, name: err.name, data: {} });
    } else if (err.name === "ValidationError") {
        handleValidationError(err, res);
    } else if (err.code && err.code == 11000) {
        handleDuplicateKeyError(err, res);
    } else if (err.name === "CastError" && err.kind === "ObjectId") {
        handleObjectIdError(res);
    } else {
        res.status(httpResponse.SERVER_ERROR);
        res.json({ success: false, message: "Server error", name: "SERVER_ERROR", data: {} });
    }
};

const handleDuplicateKeyError = (err: ErrorType, res: Response) => {
    let message;
    if (err.keyValue) {
        const field = Object.keys(err.keyValue);
        message = `${field} already exists`;
    } else {
        message = "Duplicate error";
    }

    res.status(httpResponse.CONFLICT);
    res.json({ success: false, message: message, name: "DUPLICATE_ERROR", data: {} });
};

const handleValidationError = (err: ErrorType, res: Response) => {
    const errors = Object.values(err.errors).map((error) => ({ field: error.path, error: error.message }));
    const message = "Validation error";
    res.status(httpResponse.BAD_REQUEST);
    res.json({ success: false, message: message, name: "VALIDATION_ERROR", data: errors });
};

const handleObjectIdError = (res: Response) => {
    const message = "Invalid id";
    res.status(httpResponse.BAD_REQUEST);
    res.json({ success: false, message: message, name: "VALIDATION_ERROR", data: {} });
};

export default errorHandler;
