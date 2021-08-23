import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import APIError from "../helpers/APIError";
import { httpResponse } from "../utils/constants";

const validator = (schema: Schema, dataExtractor?: (data: Request) => void) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        let data;
        if (!dataExtractor) {
            data = req.body;
        } else {
            data = dataExtractor(req.body);
        }
        const { error } = schema.validate(data);
        if (error) {
            next(new APIError(error.details[0].message, "VALIDATION_ERROR", httpResponse.BAD_REQUEST));
        }

        next();
    };
};

export default validator;
