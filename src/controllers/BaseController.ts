import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import APIError from "../helpers/APIError";
import { httpResponse } from "../utils/constants";

class BaseController<T> {
    model: Model<T>;
    modelName: string;
    constructor(model: Model<T>, modelName: string) {
        this.model = model;
        this.modelName = modelName;
    }

    public add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = { ...req.body, created_by: req.userId, updated_by: req.userId }; // change this
            const doc = new this.model(data);
            const result = await doc.save();
            res.status(httpResponse.OK).json({
                success: true,
                message: `${this.modelName} added successfully`,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
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

    public get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.model.findById(req.params.id).lean<T>();
            if (result) {
                res.status(httpResponse.OK).json({
                    success: true,
                    message: `${this.modelName} data fetched successfully`,
                    data: result,
                });
            } else {
                throw new APIError(`${this.modelName} not found`, "NOT_FOUND", httpResponse.NOT_FOUND);
            }
        } catch (error) {
            next(error);
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.model.findByIdAndDelete(req.params.id);
            if (result) {
                res.status(httpResponse.OK).json({
                    success: true,
                    message: `${this.modelName} deleted successfully`,
                    data: {},
                });
            } else {
                throw new APIError(`${this.modelName} not found`, "NOT_FOUND", httpResponse.NOT_FOUND);
            }
        } catch (error) {
            next(error);
        }
    };
    public getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.model.find().lean<T>();
            res.status(httpResponse.OK).json({
                success: true,
                message: `${this.modelName} data fetched successfully`,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default BaseController;
