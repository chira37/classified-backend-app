import { Router } from "express";
import UserController from "../controllers/UserController";
import accessController from "../middleware/accessController";
import validator from "../middleware/validator";
import { roles } from "../utils/constants";
import userValidator from "../validators/userValidator";
const { createSchema, limitedUpdateSchema, fullUpdateSchema, updateEmailSchema, verifyEmailSchema } = userValidator;

const userController = new UserController();
const router = Router({ strict: true });

router.get("/system/category/search/", accessController([roles.SUPER_ADMIN]), userController.search);
/**
 * update new email
 */
router.get(
    "/category/update-email/",
    accessController([roles.USER]),
    validator(updateEmailSchema),
    userController.updateEmail
);
router.get(
    "/category/verify-email/",
    accessController([roles.USER]),
    validator(verifyEmailSchema),
    userController.verifyEmail
);

router.get("/system/user/table/", accessController([roles.SUPER_ADMIN]), userController.getTableList);

/**
 * create user from admin panel
 */
router.post("/system/user", accessController([roles.SUPER_ADMIN]), validator(createSchema), userController.add);

/**
 * update user from user side ( email, password, role ,verify fields ar not included)
 */
router.put("/user/:id", accessController([roles.USER]), validator(limitedUpdateSchema), userController.update);

/**
 * update user from admin panel
 */
router.put(
    "/system/user/:id",
    accessController([roles.SUPER_ADMIN]),
    validator(fullUpdateSchema),
    userController.update
);

router.delete("/system/user/:id", accessController([roles.USER, roles.SUPER_ADMIN]), userController.delete);

/**
 * user can only get limited details and full details are only available to admin panel only
 */
router.get("/user/:id", accessController([roles.USER]), userController.getLimitedDetails);

/**
 * all the fields are included excluding password
 */
router.get("/system/user/:id", accessController([roles.SUPER_ADMIN]), userController.getFullDetails);

router.get("/system/user", accessController([roles.SUPER_ADMIN]), userController.getAll);

export default router;
