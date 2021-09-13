import { Router } from "express";
import CityController from "../controllers/CityController";
import accessController from "../middleware/accessController";
import { roles } from "../utils/constants";

const cityController = new CityController();
const router = Router({ strict: true });

/**
 * get all cities related to a province
 */
router.get(
    "/city/city-by-province/:province_id",
    accessController([roles.USER, roles.SUPER_ADMIN]),
    cityController.getByProvinceId
);

export default router;
