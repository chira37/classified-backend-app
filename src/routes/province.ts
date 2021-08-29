import { Router } from "express";
import ProvinceController from "../controllers/ProvinceController";
import accessController from "../middleware/accessController";
import validator from "../middleware/validator";
import { roles } from "../utils/constants";
import provinceValidator from "../validators/provinceValidator";
const { createSchema, updateSchema } = provinceValidator;

const provinceController = new ProvinceController();
const router = Router({ strict: true });

router.get("/system/province/search/", accessController([roles.SUPER_ADMIN]), provinceController.search);
router.get("/system/brand/table/", accessController([roles.SUPER_ADMIN]), provinceController.getTableList);

router.post("/system/province", accessController([roles.USER]), validator(createSchema), provinceController.add);
router.put("/system/province/:id", accessController([roles.USER]), validator(updateSchema), provinceController.update);
router.delete("/system/province/:id", accessController([roles.SUPER_ADMIN]), provinceController.delete);
router.get("/system/province/:id", accessController([roles.SUPER_ADMIN]), provinceController.get);

export default router;
