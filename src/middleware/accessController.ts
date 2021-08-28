/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import APIError from "../helpers/APIError";
import { httpResponse } from "../utils/constants";

const accessController = (roles?: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        passport.authenticate("jwt", { session: false }, (error, user, info) => {
            if (error || !user || !roles.includes(user?.role)) {
                return next(new APIError("Unauthorized", "UNAUTHORIZED", httpResponse.UNAUTHORIZED));
            }
            req.userId = user.id;
            req.userRole = user.role;

            next();
        })(req, res, next);
    };
};

export default accessController;
