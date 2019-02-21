import express, {Express} from "express";
import config from './config';
import log from './log'
import logMiddleware from './log/middleware'
import routes from './routes'
import {error5xxHandler, error404Handler} from './errors/middleware'
import cors from 'cors'

const app: Express = express()

app.use(cors({
  origin: ['http://localhost:8081', 'podcasts.psmarcin.me'],
}))
app.use(logMiddleware)
app.use(routes)
app.use(error404Handler)
app.use(error5xxHandler)

function serverCallback():void{
  log.info(`[SERVER] Listening on port: ${config.port}`)
}

app.listen(config.port, serverCallback)
