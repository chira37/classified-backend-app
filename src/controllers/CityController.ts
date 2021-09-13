import { City } from "../types/models";
import BaseController from "./BaseController";
import CityModel from "../models/CityModel";
import { NextFunction, Request, Response } from "express";
import { httpResponse } from "../utils/constants";
import APIError from "../helpers/APIError";

class CityController extends BaseController<City> {
    constructor() {
        super(CityModel, "City");
    }

    public getByProvinceId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { province_id } = req.params;
            const result = await CityModel.find({ province_id }).lean({ virtuals: true }).select("id name");
            if (result) {
                res.status(httpResponse.OK).json({
                    success: true,
                    message: "City data fetched successfully",
                    data: result,
                });
            } else {
                throw new APIError("City data not found", "NOT_FOUND", httpResponse.NOT_FOUND);
            }
        } catch (error) {
            next(error);
        }
    };
}

export default CityController;
