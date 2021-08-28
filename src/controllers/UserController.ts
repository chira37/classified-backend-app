import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { User } from "../types/models";
import { httpResponse, roles } from "../utils/constants";
import BaseController from "./BaseController";
import APIError from "../helpers/APIError";
import getPagination from "../utils/getPagination";
import getQuery from "../utils/getQuery";
import getSort from "../utils/getSort";
import UserModel from "../models/UserModel";
import EmailVerificationTokenModel from "../models/EmailVerificationTokenModel";

class AdController extends BaseController<User> {
    constructor() {
        super(UserModel, "User");
    }

    public add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = { ...req.body, created_by: req.userId, updated_by: req.userId };

            const doc = new this.model(data);
            const result = await doc.save();
            res.status(httpResponse.OK).json({
                success: true,
                message: "User added successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const { userId, userRole } = req;
            /**
             * only user can modify own data  and  restrict other user access to the account details
             */
            const filterQuery = userRole === roles.USER ? { id: userId } : { id: id };

            const user = await this.model.findOne(filterQuery);
            if (!user) throw new APIError("User not found", "NOT_FOUND", httpResponse.NOT_FOUND);

            /**
             * remove the deleted profile images from the s3
             */
            const previousImage = user.profile_image;
            const newImage = req.body.profile_image;
            if (previousImage !== newImage) {
                // todo: implement delete images in s3
            }

            const data = { ...req.body, updated_by: req.userId };
            const result = await this.model.findByIdAndUpdate(req.params.id, data, { new: true });
            if (result) {
                res.status(httpResponse.OK).json({
                    success: true,
                    message: "User updated successfully",
                    data: result,
                });
            } else {
                throw new APIError("User not found", "NOT_FOUND", httpResponse.NOT_FOUND);
            }
        } catch (error) {
            next(error);
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const { userId, userRole } = req;
            const filterQuery = userRole === roles.USER ? { id: userId } : { id: id };

            /**
             * todo: implement delete images in s3
             */

            const result = await this.model.findOneAndDelete(filterQuery);
            if (result) {
                res.status(httpResponse.OK).json({
                    success: true,
                    message: "Ad deleted successfully",
                    data: {},
                });
            } else {
                throw new APIError("Ad not found", "NOT_FOUND", httpResponse.NOT_FOUND);
            }
        } catch (error) {
            next(error);
        }
    };

    public getLimitedDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;
            const { userId, userRole } = req;
            const filterQuery = userRole === roles.USER ? userId : id;

            /**
             * remove unwanted fields ( only visible to admin panel) like password etc
             */
            const result = await UserModel.findById(filterQuery).lean().select({
                password: -1,
                note: -1,
                login_failed_count: -1,
                created_by: -1,
                updated_by: -1,
                created_at: -1,
                updated_at: -1,
            });

            if (result) {
                res.status(httpResponse.OK).json({
                    success: true,
                    message: "User data fetched successful",
                    data: result,
                });
            } else {
                throw new APIError("User data not found", "NOT_FOUND", httpResponse.NOT_FOUND);
            }
        } catch (error) {
            next(error);
        }
    };

    public getFullDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id;

            const result = await UserModel.findById(id).lean().select({
                password: -1,
            });

            if (result) {
                res.status(httpResponse.OK).json({
                    success: true,
                    message: "User data fetched successful",
                    data: result,
                });
            } else {
                throw new APIError("User data not found", "NOT_FOUND", httpResponse.NOT_FOUND);
            }
        } catch (error) {
            next(error);
        }
    };

    public getTableList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { sort_by, page = 1, rows = 10, ...rest } = req.query;
            const filterQuery = getQuery(rest);
            const sort = getSort(sort_by as string);

            const pagination = await getPagination(
                parseInt(page as string),
                parseInt(rows as string),
                filterQuery,
                this.model.modelName
            );

            const result = await this.model
                .find(filterQuery)
                .lean()
                .select("id first_name role active")
                .sort(sort)
                .skip((parseInt(page as string) - 1) * parseInt(rows as string))
                .limit(parseInt(rows as string));

            res.status(httpResponse.OK).json({
                success: true,
                message: "User data fetched successfully",
                data: result,
                pagination,
            });
        } catch (error) {
            next(error);
        }
    };

    public search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { search_text = "" } = req.query;

            const result = await this.model
                .find({
                    $or: [
                        { first_name: { $regex: search_text as string, $options: "i" } },
                        { last_name: { $regex: search_text as string, $options: "i" } },
                        { email: { $regex: search_text as string, $options: "i" } },
                        { id: { $regex: search_text as string, $options: "i" } },
                        { phone_no_1: { $regex: search_text as string, $options: "i" } },
                        { phone_no_2: { $regex: search_text as string, $options: "i" } },
                    ],
                })
                .lean()
                .select("id first_name email")
                .limit(10);

            res.status(httpResponse.OK).json({
                success: true,
                message: "User data fetched successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    public async updateEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await UserModel.findById(req.userId);

            if (!user) {
                throw new APIError("User not found", "USER_NOT_FOUND", httpResponse.NOT_FOUND);
            }

            const emailVerificationToken = await EmailVerificationTokenModel.findOne({ user_id: user.id });
            /**
             * check previous token and delete it
             */
            if (emailVerificationToken) await emailVerificationToken.delete();
            const token = crypto.randomBytes(32).toString("hex");

            const newEmailVerificationToken = new EmailVerificationTokenModel({
                user_id: user.id,
                token: token,
                created_at: Date.now(),
            });

            const result = await newEmailVerificationToken.save();

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

    /**
     *  implement send verification function
     */

    public async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { user_id, token } = req.body;
            const emailVerificationToken = await EmailVerificationTokenModel.findOne({ user_id });
            if (!emailVerificationToken) {
                throw new APIError("Invalid or expired link", "INVALID_TOKEN", httpResponse.BAD_REQUEST);
            }

            const isValidToken = await emailVerificationToken.isValidToken(token);

            if (!isValidToken) {
                throw new APIError("Invalid or expired link", "INVALID_TOKEN", httpResponse.BAD_REQUEST);
            }

            const result = await UserModel.findOneAndUpdate({ id: user_id }, { verified: true });

            if (!result) {
                throw new APIError("Invalid or expired link", "INVALID_TOKEN", httpResponse.BAD_REQUEST);
            } else {
                await emailVerificationToken.delete();
                res.status(httpResponse.OK).json({
                    success: true,
                    message: "Email is verified successfully",
                    data: {},
                });
            }
        } catch (error) {
            next(error);
        }
    }
}

export default AdController;
