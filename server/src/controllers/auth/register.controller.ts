import type { Request, Response } from "express";
import { registerSchema } from "../../schemas/auth/register.schema.js";
import { registerService } from "../../services/auth/register.service.js";

export const registerController = async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);
  const result = await registerService(validatedData);
  res.status(201).json({
    success: true,
    message: result.message,
  });
};
