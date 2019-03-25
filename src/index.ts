import { app } from "./app";
import config from "./config";
import log from "./log";

function serverCallback(): void {
  log.info(`[SERVER] Listening on port: ${config.port}`);
}

app.listen(config.port, serverCallback);

export const server = app;
