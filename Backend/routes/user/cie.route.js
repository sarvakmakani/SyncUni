import { Router } from "express";
import {
    getCies,
} from "../../controllers/user/cie.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

// Swagger documentation for GET /
// ---------------------------------
/**
 * @swagger
 * /cie:
 *   get:
 *     summary: Get upcoming CIEs for the logged-in user
 *     tags:
 *       - CIE
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CIEs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       uploadedBy:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                             avatar:
 *                               type: string
 *                 message:
 *                   type: string
 *                   example: cies fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
// ---------------------------------

const router = Router();
router.use(verifyJWT)

router.route("/").get(getCies)

export default router;
