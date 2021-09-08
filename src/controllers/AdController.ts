import { NextFunction, Request, Response } from "express";
import AdModel from "../models/AdModel";
import { Ad } from "../types/models";
import { httpResponse, roles } from "../utils/constants";
import { nanoid } from "nanoid";
import BaseController from "./BaseController";
import APIError from "../helpers/APIError";
import { difference } from "lodash";
import getPagination from "../utils/getPagination";
import getQuery from "../utils/getQuery";
import getSort from "../utils/getSort";

class AdController extends BaseController<Ad> {
    constructor() {
        super(AdModel, "Ad");
    }

    public add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { title } = req.body;
            const url = `${title.replaceAll(" ", "-")}-${nanoid(10)}`; // create unique url
            const data = { ...req.body, url, created_by: req.userId, updated_by: req.userId };

            const doc = new this.model(data);
            const result = await doc.save();
            res.status(httpResponse.OK).json({
                success: true,
                message: "Ad added successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const adId = req.params.id;
            const { userId, userRole } = req;
            const filterQuery = userRole === roles.USER ? { id: adId, user_id: userId } : { id: adId };

            const ad = await this.model.findOne(filterQuery);
            if (!ad) throw new APIError("Ad not found", "NOT_FOUND", httpResponse.NOT_FOUND);

            /**
             * remove the deleted images from the s3
             */
            const previousImages = ad.images;
            const newImages = req.body.images;
            const deletedImages = difference(previousImages, newImages);

            // todo: implement delete images in s3

            const data = { ...req.body, updated_by: req.userId };
            const result = await this.model.findByIdAndUpdate(req.params.id, data, { new: true });
            if (result) {
                res.status(httpResponse.OK).json({
                    success: true,
                    message: `${this.modelName} updated successfully`,
                    data: result,
                });
            } else {
                throw new APIError(`${this.modelName} not found`, "NOT_FOUND", httpResponse.NOT_FOUND);
            }
        } catch (error) {
            next(error);
        }
    };

    public getByUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.model
                .findOne({ url: req.params.url })
                .lean()
                .populate([
                    { path: "user_id", select: "id first_name" },
                    { path: "shop_id", select: "id name" },
                ]);
            if (result) {
                res.status(httpResponse.OK).json({
                    success: true,
                    message: "Ad data fetched successful",
                    data: result,
                });
            } else {
                throw new APIError("Ad not found", "NOT_FOUND", httpResponse.NOT_FOUND);
            }
        } catch (error) {
            next(error);
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const adId = req.params.id;
            const { userId, userRole } = req;
            const filterQuery = userRole === roles.USER ? { id: adId, user_id: userId } : { id: adId };

            // todo: implement delete images in s3

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

    public changeStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const data = { ...req.body, updated_by: req.userId };
            const result = await this.model.findByIdAndUpdate(id, data, { new: true });

            if (result) {
                res.status(httpResponse.OK).json({
                    success: true,
                    message: "Status changed successfully",
                    data: result,
                });
            } else {
                throw new APIError("Ad not found", "NOT_FOUND", httpResponse.NOT_FOUND);
            }
        } catch (error) {
            next(error);
        }
    };

    public getMyAds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { page = 1, rows = 10 } = req.query;
            const { userId } = req;
            const filterQuery = { user_id: userId };

            const pagination = await getPagination(
                parseInt(page as string),
                parseInt(rows as string),
                filterQuery,
                this.model.modelName
            );

            const result = await this.model
                .find(filterQuery)
                .lean()
                .skip((parseInt(page as string) - 1) * parseInt(rows as string))
                .limit(parseInt(rows as string));

            if (result) {
                res.status(httpResponse.OK).json({
                    success: true,
                    message: "Ad data fetched successful",
                    data: result,
                    pagination,
                });
            } else {
                throw new APIError("Ad data not found", "NOT_FOUND", httpResponse.NOT_FOUND);
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
                .populate([
                    { path: "user_id", select: "id name" },
                    { path: "shop_id", select: "id name" },
                ])
                .select("id title active status view_count")
                .sort(sort)
                .skip((parseInt(page as string) - 1) * parseInt(rows as string))
                .limit(parseInt(rows as string));

            res.status(httpResponse.OK).json({
                success: true,
                message: "Category data fetched successfully",
                data: result,
                pagination,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default AdController;
