import { Router } from "express";
import {
    getNotifications,
    markRead,
    getUnReadNotificationsCount
} from "../../controllers/user/notification.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT)

router.route("/").get(getNotifications)
router.route("/read/:id").patch(markRead)
router.route("/count").get(getUnReadNotificationsCount)

export default router;
