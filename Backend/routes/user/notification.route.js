import { Router } from "express";
import {
    getNotifications,
    markRead
} from "../../controllers/user/notification.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT)

router.route("/").get(getNotifications)
router.route("/read/:id").patch(markRead)

export default router;
