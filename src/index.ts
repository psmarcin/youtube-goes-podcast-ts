import express, {Express} from "express";
import config from './config';
import log from './log'
import logMiddleware from './log/middleware'
import routes from './routes'
import {error5xxHandler, error404Handler} from './errors/middleware'

const app: Express = express()

app.use(logMiddleware)
app.use(routes)
app.use(error404Handler)
app.use(error5xxHandler)

function serverCallback():void{
  log.info(`[SERVER] Listening on port: ${config.port}`)
  log.info(`[CONFIG] ${JSON.stringify(config)}`)
}

app.listen(config.port, serverCallback)
