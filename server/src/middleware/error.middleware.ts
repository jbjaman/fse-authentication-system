import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  console.log(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
