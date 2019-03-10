// declare var ytdl: any;
import Boom from "boom";
import ytdl from "ytdl-core";
import { IVideoFormat } from "./index.interface";

const containers = "m4a";

export function getRedirectLink(videoId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ytdl.getInfo(videoId, (err: Error, info: any) => {
      if (err) {
        throw Boom.boomify(err, { statusCode: 400 });
      }
      const audioFormats: IVideoFormat[] = ytdl.filterFormats(
        info.formats,
        "audioonly"
      );
      const format: IVideoFormat | undefined = audioFormats.find(
        (f: IVideoFormat) => f.container === containers
      );
      if (!format) {
        return reject(
          Boom.badRequest(`Video ${videoId} not found audio format`)
        );
      }
      return resolve(format.url);
    });
  });
}
