import { Router } from "express";
import {
    addEvent,
    updateEvent,
    getEvents,
} from "../../controllers/admin/event.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/isAdmin.middleware.js";

const router = Router();
router.use(verifyJWT)
router.use(isAdmin)

router.route("/").post(addEvent).get(getEvents)
router.route("/:id").patch(updateEvent)

export default router;
