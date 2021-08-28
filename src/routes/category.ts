import { Router } from "express";
import CategoryController from "../controllers/CategoryController";
import accessController from "../middleware/accessController";
import validator from "../middleware/validator";
import { roles } from "../utils/constants";
import categoryValidator from "../validators/categoryValidator";
const { createSchema, updateSchema } = categoryValidator;

const categoryController = new CategoryController();
const router = Router({ strict: true });

router.get("/system/category/search/", accessController([roles.SUPER_ADMIN]), categoryController.search);
router.get("/system/category/table/", accessController([roles.SUPER_ADMIN]), categoryController.getTableList);

/**
 * use in the user side ( categories with nested sub categories)
 * public api
 */
router.get("/category", categoryController.getAllWithReferenceSubCategories);

router.post("/system/category", accessController([roles.SUPER_ADMIN]), validator(createSchema), categoryController.add);
router.put(
    "/system/category/:id",
    accessController([roles.SUPER_ADMIN]),
    validator(updateSchema),
    categoryController.update
);
router.delete("/system/category/:id", accessController([roles.SUPER_ADMIN]), categoryController.delete); // super admin
router.get("/system/category/:id", accessController([roles.SUPER_ADMIN]), categoryController.get); // super admin
router.get("/system/category", accessController([roles.SUPER_ADMIN]), categoryController.getAll); // super admin

export default router;
