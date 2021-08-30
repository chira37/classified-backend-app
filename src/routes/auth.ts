import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/AuthController";
import accessController from "../middleware/accessController";
import validator from "../middleware/validator";
import { roles } from "../utils/constants";
import authValidator from "../validators/authValidator";

const { signUpSchema, signInSchema, forgotPasswordSchema, resetPasswordSchema, updatePasswordSchema } = authValidator;

const userController = new UserController();
const router = Router({ strict: true });

router.post(
    "/auth/signup",
    validator(signUpSchema),
    passport.authenticate("signUp", { session: false }),
    userController.signUp
);
router.post(
    "/system/auth/signup",
    validator(signUpSchema),
    passport.authenticate("signUpAdmin", { session: false }),
    userController.signUp
);
router.post("/auth/signin", validator(signInSchema), userController.signIn);
router.post("/auth/forgot-password", validator(forgotPasswordSchema), userController.forgotPassword);
router.post("/auth/reset-password", validator(resetPasswordSchema), userController.resetPassword);
router.post(
    "/auth/update-password",
    accessController([roles.USER]),
    validator(updatePasswordSchema),
    userController.updatePassword
);

export default router;
