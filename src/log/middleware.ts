import { IncomingHttpHeaders } from "http";
import { Request,Response, NextFunction } from "express";
import log from './index'

export default function logger(req:Request, res: Response, next: NextFunction ):void{
  const headers:IncomingHttpHeaders = req.headers
  log.info(`[REQUEST] ${req.method} ${req.path} ${JSON.stringify(headers)}`)
  return next()
}
