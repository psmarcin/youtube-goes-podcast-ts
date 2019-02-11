import { Request, Response, NextFunction } from "express";
import Boom, {} from 'boom'
import log from './../log'

export function error5xxHandler(error: Boom, req: Request, res: Response, next: NextFunction): void {
  console.log('Error', error)
  log.error(Error(error.output.payload.error), `[SERVER] Route ${req.method} ${req.path}`)
  res.status(error.output.statusCode).json(error.output.payload)
}
export function error404Handler(req: Request, res: Response, next: NextFunction): void {
  const notFoundError = Boom.notFound()
  log.error(notFoundError, `[SERVER] Route ${req.method} ${req.path}`)
  res.status(notFoundError.output.statusCode).json(notFoundError.output.payload)
}
