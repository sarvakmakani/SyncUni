import { Router } from "express";
import {
    getDocuments,
    addDocument,
    deleteDocument
} from "../../controllers/user/vault.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT)

/**
 * @openapi
 * tags:
 *   name: Vault
 *   description: Endpoints for managing student documents in the Vault
 */

/**
 * @openapi
 * /vault:
 *   get:
 *     summary: Get all documents uploaded by the logged-in user
 *     tags: [Vault]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user documents with signed URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       document:
 *                         type: string
 *                         description: Signed URL to access the document
 */
router.route("/").get(getDocuments);

/**
 * @openapi
 * /vault:
 *   post:
 *     summary: Upload a new document to the Vault
 *     tags: [Vault]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name/title of the document
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Document file to upload
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     document:
 *                       type: string
 *                       description: Cloudinary public ID
 *       400:
 *         description: Document upload failed
 *       401:
 *         description: Document not uploaded
 */
router.route("/").post(upload.single("file"), addDocument);

/**
 * @openapi
 * /vault/{id}:
 *   delete:
 *     summary: Delete a document by its ID
 *     tags: [Vault]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the document to delete
 *     responses:
 *       201:
 *         description: Document deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       500:
 *         description: Document deletion failed
 */
router.route("/:id").delete(deleteDocument);


export default router;
