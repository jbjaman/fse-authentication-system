import type { Request, Response } from "express";

export const registerController = (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "Registrtion endpoint is working",
  });
};
