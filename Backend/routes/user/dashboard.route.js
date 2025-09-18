import { Router } from "express";
import {
    getStatistics,
} from "../../controllers/user/dashboard.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT)

/**
 * @openapi
 * tags:
 *   name: Statistics
 *   description: Endpoints to get aggregated statistics for the logged-in user
 */

/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Get overview statistics for the logged-in user
 *     tags: [Statistics]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User statistics including active forms, polls, events, and vault items
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
 *                     name:
 *                       type: string
 *                       description: Name of the user
 *                     activeForms:
 *                       type: integer
 *                       description: Total number of active forms
 *                     activePolls:
 *                       type: integer
 *                       description: Total number of active polls
 *                     activeEvents:
 *                       type: integer
 *                       description: Total number of upcoming events
 *                     valutItems:
 *                       type: integer
 *                       description: Total number of items uploaded in the vault
 *                     forms:
 *                       type: array
 *                       description: List of the 3 most recent active forms
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           deadline:
 *                             type: string
 *                             format: date-time
 */
router.route("/").get(getStatistics);


export default router;
