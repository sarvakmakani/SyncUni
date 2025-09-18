import { Router } from "express";
import {
    addNotification
} from "../../controllers/admin/notification.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/isAdmin.middleware.js";

const router = Router();
router.use(verifyJWT)
router.use(isAdmin)

router.route("/").post(addNotification)

export default router;
