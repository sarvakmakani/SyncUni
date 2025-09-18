import { Router } from "express";
import {
    addForm,
    updateForm,
    getForms,
    formStatus
} from "../../controllers/admin/form.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/isAdmin.middleware.js";

const router = Router();
router.use(verifyJWT)
router.use(isAdmin)

router.route("/").post(addForm).get(getForms)
router.route("/:id").patch(updateForm).get(formStatus)

export default router;
