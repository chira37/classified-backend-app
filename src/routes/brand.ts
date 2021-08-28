import { Router } from "express";
import BrandController from "../controllers/BrandController";
import accessController from "../middleware/accessController";
import validator from "../middleware/validator";
import { roles } from "../utils/constants";
import brandValidator from "../validators/brandValidator";
const { createSchema, updateSchema } = brandValidator;

const brandController = new BrandController();
const router = Router({ strict: true });

router.get("/system/brand/search/", accessController([roles.SUPER_ADMIN]), brandController.search);
router.get("/system/brand/table/", accessController([roles.SUPER_ADMIN]), brandController.getTableList);

router.post("/system/brand", accessController([roles.SUPER_ADMIN]), validator(createSchema), brandController.add);
router.put("/system/brand/:id", accessController([roles.SUPER_ADMIN]), validator(updateSchema), brandController.update);
router.delete("/system/brand/:id", accessController([roles.SUPER_ADMIN]), brandController.delete);
router.get("/system/brand/:id", accessController([roles.SUPER_ADMIN]), brandController.get);
router.get("/system/brand", accessController([roles.SUPER_ADMIN]), brandController.getAll);

export default router;
