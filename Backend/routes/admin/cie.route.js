import { Router } from "express";
import {
    addCie,
    updateCie,
    getCies,
    deleteCie
} from "../../controllers/admin/cie.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/isAdmin.middleware.js";

const router = Router();
router.use(verifyJWT)
router.use(isAdmin)

router.route("/").post(addCie).get(getCies)
router.route("/:id").patch(updateCie).delete(deleteCie)

export default router;
