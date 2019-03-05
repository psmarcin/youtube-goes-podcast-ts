// declare var ytdl: any;
import Boom from "boom";
import ytdl, { videoFormat } from "ytdl-core";

const containers = "m4a";

export function getRedirectLink(videoId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ytdl.getInfo(videoId, (err: Error, info: any) => {
      if (err) {
        throw err;
      }
      const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
      const format: videoFormat | undefined = audioFormats.find(
        (f: any) => f.container === containers
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
