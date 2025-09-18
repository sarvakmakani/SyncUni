import { Router } from "express";
import {
    getDocuments,
    addDocument,
    deleteDocument,
    getUserDocuments,
    deleteUserDocument
} from "../../controllers/admin/vault.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import isAdmin from "../../middlewares/isAdmin.middleware.js";

const router = Router();
router.use(verifyJWT)
router.use(isAdmin)

router.route("/").get(getDocuments).post(upload.single("document"),addDocument)
router.route("/:id").delete(deleteDocument)
router.route("/user/:userId").post(getUserDocuments)
router.route("/:userId/:documentId").delete(deleteUserDocument)

export default router;
