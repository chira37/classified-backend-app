import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/AuthController";
import validator from "../middleware/validator";
import authValidator from "../validators/authValidator";

const { signUpSchema, signInSchema, forgotPasswordSchema, resetPasswordSchema } = authValidator;

const userController = new UserController();
const router = Router({ strict: true });

router.post(
    "/auth/signup",
    validator(signUpSchema),
    passport.authenticate("signUp", { session: false }),
    userController.signUp
);
router.get("/auth/signin", validator(signInSchema), userController.signIn);
router.get("/auth/forgot-password", validator(forgotPasswordSchema), userController.forgotPassword);
router.get("/auth/reset-password", validator(resetPasswordSchema), userController.resetPassword);

// router.post("/brand", accessController, validator(createSchema), brandController.add);
// router.put("/brand/:id", accessController, validator(updateSchema), brandController.update);
// router.delete("/brand/:id", accessController, brandController.deleteById);
// router.get("/brand/:id", accessController, brandController.getById);
// router.get("/brand", accessController, brandController.getAll);

export default router;
