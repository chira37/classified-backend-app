import { Router } from "express";
import SubCategoryController from "../controllers/SubCategoryController";
import accessController from "../middleware/accessController";
import validator from "../middleware/validator";
import { roles } from "../utils/constants";
import subCategoryValidator from "../validators/subCategoryValidator";
const { createSchema, updateSchema } = subCategoryValidator;

const subCategoryController = new SubCategoryController();
const router = Router({ strict: true });

router.get("/system/sub-category/search/", accessController([roles.SUPER_ADMIN]), subCategoryController.search);
router.get("/system/sub-category/table/", accessController([roles.SUPER_ADMIN]), subCategoryController.getTableList);

router.post(
    "/system/sub-category",
    accessController([roles.SUPER_ADMIN]),
    validator(createSchema),
    subCategoryController.add
);
router.put(
    "/system/sub-category/:id",
    accessController([roles.SUPER_ADMIN]),
    validator(updateSchema),
    subCategoryController.update
);
router.delete("/system/sub-category/:id", accessController([roles.SUPER_ADMIN]), subCategoryController.delete);
router.get("/system/sub-category/:id", accessController([roles.SUPER_ADMIN]), subCategoryController.get);
router.get("/system/sub-category", accessController([roles.SUPER_ADMIN]), subCategoryController.getAll);

export default router;
