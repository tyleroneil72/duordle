import { Request, Response, NextFunction } from "express";
// TODO: Fis this to use the correct status codes using the http-status-codes package
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};
