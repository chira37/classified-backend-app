import { Router } from "express";
import AdController from "../controllers/AdController";
import accessController from "../middleware/accessController";
import validator from "../middleware/validator";
import { roles } from "../utils/constants";
import adValidator from "../validators/adValidator";
const { limitedCreateSchema, fullCreateSchema, limitedUpdateSchema, fullUpdateSchema, changeStatusSchema } =
    adValidator;

const adController = new AdController();
const router = Router({ strict: true });

/**
 * user ads with pagination
 */
router.get("/ad/my-ads/", accessController([roles.USER]), adController.getMyAds);

router.put(
    "/system/ad/change-status/:id",
    accessController([roles.SUPER_ADMIN]),
    validator(changeStatusSchema),
    adController.changeStatus
);

/**
 * admin panel table with pagination
 */
router.get("/system/table/", accessController([roles.SUPER_ADMIN]), adController.getTableList);

/**
 * create ad from user side ( without "status")
 */
router.post("/ad", accessController([roles.USER]), validator(limitedCreateSchema), adController.add);

/**
 * create ad from admin panel ( "status" is included)
 */
router.post("system/ad", accessController([roles.SUPER_ADMIN]), validator(fullCreateSchema), adController.add);

/**
 * update ad from user side  ( without "status" , user have no access to status)
 */
router.put("/ad/:id", accessController([roles.USER]), validator(limitedUpdateSchema), adController.update);

/**
 * update ad from admin panel ( "status" is included)
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
