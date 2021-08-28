import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import crypto from "crypto";
import config from "../config";
import APIError from "../helpers/APIError";
import PasswordResetTokenModel from "../models/PasswordResetTokenModel";
import UserModel from "../models/UserModel";
import { httpResponse } from "../utils/constants";

class AuthController {
    public async signUp(req: Request, res: Response): Promise<void> {
        res.status(httpResponse.OK).json({
            success: true,
            message: "Sign up success",
            data: req.user,
        });
    }

    public async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
        passport.authenticate("signIn", async (error, user) => {
            try {
                if (error || !user) {
                    if (error instanceof Error) {
                        throw error; //system error
                    }
                    throw new APIError(error.message, error.name, error.httpCode);
                }

                req.logIn(user, { session: false }, async (error) => {
                    if (error) return next(error);
                    const token = jwt.sign(user, config.jwtSecrete);
                    res.json({
                        success: true,
                        message: "Sign In success",
                        data: { ...user, token },
                    });
                });
            } catch (error) {
                next(error);
            }
        })(req, res, next);
    }

    public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await UserModel.findOne({ email: req.body.email });

            if (!user) {
                throw new APIError("User not found", "USER_NOT_FOUND", httpResponse.NOT_FOUND);
            }

            const passwordResetToken = await PasswordResetTokenModel.findOne({ user_id: user.id });
            /**
             * check previous token and delete it
             */
            if (passwordResetToken) await passwordResetToken.delete();
            const token = crypto.randomBytes(32).toString("hex");

            const newPasswordResetToken = new PasswordResetTokenModel({
                user_id: user.id,
                token: token,
                created_at: Date.now(),
            });

            const result = await newPasswordResetToken.save();

            if (!result) {
                throw new APIError();
            }

            /**
             * implement send email with token
             */

            res.json(token);
        } catch (error) {
            next(error);
        }
    }

    public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { user_id, token, password } = req.body;
            const passwordResetToken = await PasswordResetTokenModel.findOne({ user_id });
            if (!passwordResetToken) {
                throw new APIError(
                    "Invalid or expired password reset token",
                    "INVALID_TOKEN",
                    httpResponse.BAD_REQUEST
                );
            }

            const isValidToken = await passwordResetToken.isValidToken(token);

            if (!isValidToken) {
                throw new APIError(
                    "Invalid or expired password reset token",
                    "INVALID_TOKEN",
                    httpResponse.BAD_REQUEST
                );
            }

            const result = await UserModel.findOneAndUpdate({ id: user_id }, { password });

            if (!result) {
                throw new APIError(
                    "Invalid or expired password reset token",
                    "INVALID_TOKEN",
                    httpResponse.BAD_REQUEST
                );
            } else {
                // await passwordResetToken.delete();
                res.status(httpResponse.OK).json({
                    success: true,
                    message: "Password reset successfully",
                    data: {},
                });
            }
        } catch (error) {
            next(error);
        }
    }

    public updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await UserModel.findOneAndUpdate({ id: req.userId }, { password: req.body.password });

            if (result) {
                res.status(httpResponse.OK).json({
                    success: true,
                    message: "Password updated successfully",
                    data: {},
                });
            } else {
                throw new APIError("User not found", "NOT_FOUND", httpResponse.NOT_FOUND);
            }
        } catch (error) {
            next(error);
        }
    };
}

export default AuthController;
