import { Router } from "express";
import {
    getPolls,
    votePoll
} from "../../controllers/user/poll.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT)

/**
 * @openapi
 * tags:
 *   name: Polls
 *   description: Endpoints for student polls
 */

/**
 * @openapi
 * /poll:
 *   get:
 *     summary: Get all active polls for the logged-in user
 *     tags: [Polls]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of active polls with vote status
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
 *                       deadline:
 *                         type: string
 *                         format: date-time
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *                       alreadyVoted:
 *                         type: boolean
 */
router.route("/").get(getPolls);


/**
 * @openapi
 * /poll/{id}:
 *   post:
 *     summary: Vote on a poll
 *     tags: [Polls]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The poll ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               option:
 *                 type: integer
 *                 description: The index of the selected option
 *     responses:
 *       200:
 *         description: Vote recorded successfully
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
 *                     pollId:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     optionIdx:
 *                       type: integer
 *       400:
 *         description: User already voted or invalid option
 *       404:
 *         description: Poll not found
 */
router.route("/:id").post(votePoll);


export default router;
