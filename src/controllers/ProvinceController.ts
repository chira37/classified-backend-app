/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { httpResponse } from "../utils/constants";
import APIError from "../helpers/APIError";
import CityModel from "../models/CityModel";
import { City } from "../types/models";
import ProvinceModel from "../models/ProvinceModel";
import getQuery from "../utils/getQuery";
import getSort from "../utils/getSort";
import getPagination from "../utils/getPagination";
import { differenceBy, intersectionBy } from "lodash";

class ProvinceController {
    public add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req;
            const doc = new ProvinceModel({ name: req.body.name, created_by: userId, updated_by: userId });
            const provinceResult = await doc.save();

            if (!provinceResult) {
                throw new APIError();
            }

            const cities = req.body.cities.map((item: City) => ({
                ...item,
                province_id: provinceResult._id,
                created_by: userId,
                updated_by: userId,
            }));
            const cityResult = await CityModel.insertMany(cities);

            res.status(httpResponse.OK).json({
                success: true,
                message: "Ad added successfully",
                data: provinceResult,
            });
        } catch (error) {
            next(error);
        }
    };

    public get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            /**
             * get province with nested city data
             */
            const provinceResult = await ProvinceModel.findById(id).lean();
            const cityResult = await CityModel.find({ province_id: id }).lean();
            const result = { ...provinceResult, cities: cityResult };

            res.status(httpResponse.OK).json({
                success: true,
                message: "Province data fetched successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { cities, name } = req.body;
            const { id } = req.params;
            const { userId } = req;

            const provinceResult = await ProvinceModel.findByIdAndUpdate(
                id,
                { name, updated_by: userId },
                { new: true }
            );

            if (!provinceResult) {
                throw new APIError("Province not found", "NOT_FOUND", httpResponse.NOT_FOUND);
            }

            /**
             * virtual middleware is added to get the id property
             */
            const previousCities = await CityModel.find({ province_id: id }).lean({ virtuals: true }).select("id");
            const deletedCities = differenceBy(previousCities, cities, "id");
            const updatedCities = intersectionBy(cities, previousCities, "id");
            const addedCities = differenceBy(cities, previousCities, "id");

            /**
             * update delete and insert cities
             */
            await CityModel.bulkWrite([
                ...updatedCities.map((item: any) => ({
                    updateOne: {
                        filter: {
                            _id: item.id,
                        },
                        update: {
                            $set: { ...item, updated_by: userId },
                        },
                    },
                })),

                { deleteMany: { filter: { _id: { $in: deletedCities.map((item) => item.id) } } } },

                ...addedCities.map((item: any) => ({
                    insertOne: {
                        document: { ...item, province_id: id, created_by: userId, updated_by: userId },
                    },
                })),
            ]);

            res.status(httpResponse.OK).json({
                success: true,
                message: "Ad added successfully",
                data: provinceResult,
            });
        } catch (error) {
            next(error);
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;

            /**
             * delete province and reference city data also
             */
            await ProvinceModel.findByIdAndDelete(id);
            await CityModel.deleteMany({ province_id: id });

            res.status(httpResponse.OK).json({
                success: true,
                message: "Province deleted successfully",
                data: {},
            });
        } catch (error) {
            next(error);
        }
    };

    public search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { search_text = "" } = req.query;

            const result = await ProvinceModel.find({
                name: { $regex: search_text as string, $options: "i" },
            })
                .lean()
                .select("name id")
                .limit(10);

            res.status(httpResponse.OK).json({
                success: true,
                message: "Province data fetched successfully",
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
                ProvinceModel.modelName
            );

            const result = await ProvinceModel.find(filterQuery)
                .lean()
                .select("id name created_at")
                .sort(sort)
                .skip((parseInt(page as string) - 1) * parseInt(rows as string))
                .limit(parseInt(rows as string));

            res.status(httpResponse.OK).json({
                success: true,
                message: "Province data fetched successfully",
                data: result,
                pagination,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default ProvinceController;
