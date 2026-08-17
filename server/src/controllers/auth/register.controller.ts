import type { Request, Response } from "express";
import { registerService } from "../../services/auth/register.service.js";

export const registerController = async (req: Request, res: Response) => {
  const result = await registerService();
  res.status(201).json({
    success: true,
    message: result.message,
  });
};
