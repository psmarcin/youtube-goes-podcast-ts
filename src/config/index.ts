import { config, DotenvConfigOutput } from "dotenv";
import Joi, { JoiObject } from "joi";
import log from "./../log";
import { IConfig } from "./index.interface";

const result: DotenvConfigOutput = config();

if (result.error) {
  log.info(result.error, "Can't load environment variables from file");
}

const envVariablesSchema: JoiObject = Joi.object({
  API_URL: Joi.string().required(),
  PORT: Joi.string().optional(),
  VIDEO_API_URL: Joi.string().required(),
  YOUTUBE_API_KEY: Joi.string().required()
});

const { value, error }: Joi.ValidationResult<any> = Joi.validate(
  {
    API_URL: process.env.API_URL,
    PORT: process.env.PORT,
    VIDEO_API_URL: process.env.VIDEO_API_URL,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY
  },
  envVariablesSchema
);

if (error) {
  log.error(error, `Missing config values`);
  throw error;
}

let mappedConfig: IConfig = {};

if (value) {
  mappedConfig = {
    apiUrl: value.API_URL,
    port: value.PORT || "8080",
    videoUrl: value.VIDEO_API_URL,
    youtubeApiKey: value.YOUTUBE_API_KEY
  };
}

export default mappedConfig;
