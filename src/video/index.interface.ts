import { videoFormat } from "ytdl-core";
export interface IVideoFormat
  extends Pick<videoFormat, Exclude<keyof videoFormat, "container">> {
  container: "flv" | "3gp" | "mp4" | "webm" | "ts" | "m4a";
}
