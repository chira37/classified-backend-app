/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import APIError from "../helpers/APIError";
import { httpResponse } from "../utils/constants";

const accessController = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate("jwt", { session: false }, (error, user, info) => {
        if (error || !user) {
            return next(new APIError("Unauthorized", "UNAUTHORIZED", httpResponse.UNAUTHORIZED));
        }
        req.userId = user._id;
        next();
    })(req, res, next);
};

export default accessController;
