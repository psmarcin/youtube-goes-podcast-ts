import { config, DotenvConfigOutput, DotenvParseOutput } from "dotenv";
import Joi, { JoiObject, ValidationError, ValidationResult } from 'joi'
import log from './../log'
import { Iconfig } from './interface'

const result: DotenvConfigOutput = config()
if(result.error){
  log.error(result.error, 'Loading environment variables')
}

const envVariablesSchema: JoiObject = Joi.object({
  YOUTUBE_API_KEY: Joi.string().required(),
  PORT: Joi.string().optional()
})

const res: Joi.ValidationResult<DotenvParseOutput | undefined> = Joi.validate(result.parsed, envVariablesSchema)

if (res.error){
  log.error(res.error, `Missing config values`)
  throw res.error
}

let mappedConfig: Iconfig = {};

if(res.value){
  mappedConfig = {
    youtubeApiKey: res.value.YOUTUBE_API_KEY,
    port: res.value.PORT || '8080'
  }
}

export default mappedConfig
