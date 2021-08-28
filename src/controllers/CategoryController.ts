import { NextFunction, Request, Response } from "express";
import { Category } from "../types/models";
import { httpResponse } from "../utils/constants";
import BaseController from "./BaseController";
import getPagination from "../utils/getPagination";
import getQuery from "../utils/getQuery";
import getSort from "../utils/getSort";
import CategoryModel from "../models/CategoryModel";

class CategoryController extends BaseController<Category> {
    constructor() {
        super(CategoryModel, "Category");
    }

    public getAllWithReferenceSubCategories = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await CategoryModel.find().lean().populate("sub_category_id", "id name").select("id name");

            res.status(httpResponse.OK).json({
                success: true,
                message: "Category data fetched successfully",
                data: result,
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
                    name: { $regex: search_text as string, $options: "i" },
                })
                .lean()
                .select("name id")
                .limit(10);

            res.status(httpResponse.OK).json({
                success: true,
                message: "Category data fetched successfully",
                data: result,
            });
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
                .select("id name created_at")
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

export default CategoryController;
