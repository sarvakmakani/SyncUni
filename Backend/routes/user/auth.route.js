import { Router } from "express";
import {
  authenticateController,
  callbackController,
  refreshController,
  logout,
  meController
} from "../../controllers/user/auth.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/google", authenticateController);
router.get("/google/callback", callbackController);
router.post("/refresh-token", refreshController);
router.post("/logout", logout);
router.get("/me", verifyJWT, meController);


export default router;
