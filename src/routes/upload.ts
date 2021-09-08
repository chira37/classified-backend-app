import { Router } from "express";
import UploadController from "../controllers/UploadController";
import accessController from "../middleware/accessController";
import { roles } from "../utils/constants";

const router = Router({ strict: true });
const uploadController = new UploadController();

router.get("/upload/image", accessController([roles.SUPER_ADMIN, roles.USER]), uploadController.uploadImage);

export default router;
