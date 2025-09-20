import { Router } from "express";
import {
    getForms
} from "../../controllers/user/form.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT)

router.route("/").get(getForms)

export default router;
