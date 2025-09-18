import { Router } from "express";
import {
    getEvents,
} from "../../controllers/user/event.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT)

router.route("/").get(getEvents)

export default router;
