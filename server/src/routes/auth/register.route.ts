import { Router } from "express";
import { registerController } from "../../controllers/auth/register.controller.js";
import { asyncHandler } from "../../middleware/async-handler.js";

const router = Router();

router.post("/register", asyncHandler(registerController));

export default router;
