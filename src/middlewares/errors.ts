import Boom from "boom";
import { NextFunction, Request, Response } from "express";
import log from "../log";
import { IRequestError } from "./error.interface";

const NOT_FOUND_ERROR = Boom.notFound();

export function error5xxHandler(
  error: IRequestError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let err: Boom;
  if (!Boom.isBoom(error)) {
    err = Boom.boomify(error) as Boom;
  } else {
    err = error;
  }
  log.error(err, `[SERVER] Route ${req.method} ${req.path}`);
  res.status(err.output.statusCode).json(err.output.payload);
}
export function error404Handler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  log.error(NOT_FOUND_ERROR, `[SERVER] Route ${req.method} ${req.path}`);
  res
    .status(NOT_FOUND_ERROR.output.statusCode)
    .json(NOT_FOUND_ERROR.output.payload);
}
