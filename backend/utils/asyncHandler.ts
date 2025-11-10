import { Request, Response, NextFunction } from "express";

/**
 * Async handler wrapper to avoid try-catch in every controller
 * Automatically catches errors and passes them to error handler middleware
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
