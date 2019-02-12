import { config, DotenvConfigOutput, DotenvParseOutput } from "dotenv";
import Joi, { JoiObject } from 'joi'
import log from './../log'
import { Iconfig } from './interface'

let result: DotenvConfigOutput = config();

if (result.error) {
  log.error(result.error, 'Loading environment variables')
}

const envVariablesSchema: JoiObject = Joi.object({
  YOUTUBE_API_KEY: Joi.string().required(),
  PORT: Joi.string().optional()
})

const res: Joi.ValidationResult<any> = Joi.validate({ 
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY, 
  PORT: process.env.PORT }, envVariablesSchema)

if (res.error) {
  log.error(res.error, `Missing config values`)
  throw res.error
}

let mappedConfig: Iconfig = {};

if (res.value) {
  mappedConfig = {
    youtubeApiKey: res.value.YOUTUBE_API_KEY,
    port: res.value.PORT || '8080'
  }
}

log.info(mappedConfig,`[CONFIG]`)

export default mappedConfig
