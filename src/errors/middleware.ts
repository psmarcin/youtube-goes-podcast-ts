import Boom from "boom";
import { NextFunction, Request, Response } from "express";
import log from "./../log";

export function error5xxHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let err = error;
  if (!Boom.isBoom(error)) {
    err = Boom.boomify(error);
  }
  log.error(err, `[SERVER] Route ${req.method} ${req.path}`);
  res.status(err.output.statusCode).json(err);
}
export function error404Handler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const notFoundError = Boom.notFound();
  log.error(notFoundError, `[SERVER] Route ${req.method} ${req.path}`);
  res
    .status(notFoundError.output.statusCode)
    .json(notFoundError.output.payload);
}
