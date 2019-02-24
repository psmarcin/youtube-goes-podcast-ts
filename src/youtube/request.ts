import { CoreOptions, Request, RequestAPI, RequiredUriUrl } from "request";
import { defaults } from "request-promise-native";
import config from "./../config";

const request: RequestAPI<Request, CoreOptions, RequiredUriUrl> = defaults({
  baseUrl: `https://www.googleapis.com/youtube/v3/`,
  json: true,
  qs: {
    key: config.youtubeApiKey,
  },
});

export default request;
