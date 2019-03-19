import { NextFunction, Request, Response } from "express";
import { IncomingHttpHeaders } from "http";
import log from "./index";

export default function logger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const headers: IncomingHttpHeaders = req.headers;
  log.info(`[REQUEST] ${req.method} ${req.path} ${JSON.stringify(headers)}`);
  return next();
}
