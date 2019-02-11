import { RequestAPI, Request, CoreOptions, RequiredUriUrl } from "request";
import { defaults, RequestPromise } from "request-promise-native";
import config from './../config'

const request: RequestAPI<Request, CoreOptions, RequiredUriUrl> = defaults({
  baseUrl: `https://www.googleapis.com/youtube/v3/`,
  qs:{
    key: config.youtubeApiKey
  },
  json: true
})

export default request
