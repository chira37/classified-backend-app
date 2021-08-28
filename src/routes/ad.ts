import { Router } from "express";
import AdController from "../controllers/AdController";
import accessController from "../middleware/accessController";
import validator from "../middleware/validator";
import { roles } from "../utils/constants";
import adValidator from "../validators/adValidator";
const { limitedCreateSchema, fullCreateSchema, limitedUpdateSchema, fullUpdateSchema } = adValidator;

const adController = new AdController();
const router = Router({ strict: true });

/**
 * user ads with pagination
 */
router.get("/ad/my-ads/", accessController([roles.USER]), adController.getMyAds);

/**
 * admin panel table with pagination
 */
router.get("/system/table/", accessController([roles.SUPER_ADMIN]), adController.getTableList);

/**
 * create ad from user side
 */
router.post("/ad", accessController([roles.USER]), validator(limitedCreateSchema), adController.add);

/**
 * create ad from admin panel ( "status" is include)
 */
router.post("system/ad", accessController([roles.SUPER_ADMIN]), validator(limitedCreateSchema), adController.add);

/**
 * update ad from user side
 */
router.put("/ad/:id", accessController([roles.USER]), validator(limitedUpdateSchema), adController.update);

/**
 * update ad from admin panel ( "status" is include)
 */
router.put("/system/ad/:id", accessController([roles.SUPER_ADMIN]), validator(fullUpdateSchema), adController.update);

router.delete(
    "/ad/:id",
    accessController([roles.USER, roles.SUPER_ADMIN, roles.ADMIN, roles.SUPER_EDITOR]),
    adController.delete
);
router.get("/ad/:url", adController.getByUrl);
router.get("/system/ad/:url", adController.getByUrl);
router.get("/ad", accessController, adController.getAll);

export default router;
