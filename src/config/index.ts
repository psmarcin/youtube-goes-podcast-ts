import { config, DotenvConfigOutput } from "dotenv";
import Joi, { JoiObject } from "joi";
import log from "./../log";
import { Iconfig } from "./interface";

const result: DotenvConfigOutput = config();

if (result.error) {
  log.error(result.error, "Loading environment variables");
}

const envVariablesSchema: JoiObject = Joi.object({
  API_URL: Joi.string().required(),
  PORT: Joi.string().optional(),
  YOUTUBE_API_KEY: Joi.string().required()
});

const res: Joi.ValidationResult<any> = Joi.validate(
  {
    API_URL: process.env.API_URL,
    PORT: process.env.PORT,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY
  },
  envVariablesSchema
);

if (res.error) {
  log.error(res.error, `Missing config values`);
  throw res.error;
}

let mappedConfig: Iconfig = {};

if (res.value) {
  mappedConfig = {
    apiUrl: res.value.API_URL,
    port: res.value.PORT || "8080",
    youtubeApiKey: res.value.YOUTUBE_API_KEY
  };
}

export default mappedConfig;
