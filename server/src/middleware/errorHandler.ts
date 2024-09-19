import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from '../errors/customErrors';

export const errorHandler = (
  err: Error | NotFoundError | BadRequestError | UnauthenticatedError | UnauthorizedError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  const statusCode = 'statusCode' in err ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'something went wrong';
  res.status(statusCode).json({ message });
};
