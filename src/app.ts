import cors from "cors";
import express, { Express } from "express";
import config from "./config";
import log from "./log";
import logMiddleware from "./log/middleware";
import { error404Handler, error5xxHandler } from "./middlewares/errors";
import routes from "./routes";

export const app: Express = express();

app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "https://yt.psmarcin.me",
      "https://yt.psmarcin.dev"
    ]
  })
);
app.use(logMiddleware);
app.use(routes);
app.use(error404Handler);
app.use(error5xxHandler);
