import Boom from "boom";
import { head } from "request-promise-native";
import config from "./../config";
import { IItem, IVideo, IVideoDetails } from "./video.interface";
import request from "./request";
import { IFeedOptions } from "../routes.interface";
const VIDEO_BASE_URL = `https://youtube.com/watch?v=`;
const VIDEO_DIRECT_BASE_URL = `${config.apiUrl}video/`;

export async function getAll(options: IFeedOptions): Promise<IVideo[]> {
  let response: any;
  try {
    response = await request.get("search", {
      qs: {
        channelId: options.channelId,
        maxResults: options.count,
        order: "date",
        part: "snippet",
        q: options.q
      }
    });
  } catch (error) {
    throw Boom.boomify(error);
  }
  const items: IItem[] = response.items.filter((i: any) => i.id.videoId);
  try {
    const [videos, details]: [IVideo[], IItem[]] = await Promise.all([
      getFileDetails(items),
      getDetails(items.map(item => item.id.videoId))
    ]);
    return merge(videos, details);
  } catch (error) {
    throw Boom.boomify(error);
  }
}

async function getFileDetails(items: IItem[]): Promise<IVideo[]> {
  return Promise.all(
    items.map(
      async (item: IItem): Promise<IVideo> => {
        const snippet = item.snippet;
        return {
          channelId: snippet.channelId,
          description: snippet.description,
          duration: "0",
          id: item.id.videoId,
          publishedAt: new Date(snippet.publishedAt),
          thumbnails: snippet.thumbnails,
          title: snippet.title,
          videoDetails: item.id.videoId
            ? await getVideoDetails(item.id.videoId)
            : {
                contentLength: 0,
                contentType: ""
              }
        };
      }
    )
  );
}

async function getDetails(videoIds: string[]): Promise<IItem[]> {
  const response: any = await request.get("videos", {
    qs: {
      id: videoIds.join(","),
      part: "snippet,contentDetails"
    }
  });
  return response.items;
}

function merge(videos: IVideo[], details: IItem[]): IVideo[] {
  return videos.map(video => {
    const videoDetails: IItem | undefined = details.find(
      detail => detail.id.videoId === video.id
    );
    if (!videoDetails) {
      return video;
    }
    video.thumbnails = videoDetails.snippet.thumbnails;
    video.description = videoDetails.snippet.description;
    video.duration = videoDetails.contentDetails.duration;
    return video;
  });
}

export function serialize(items: IVideo[]): object[] {
  return items.map(
    (item: IVideo, index: number): object => {
      return serializeItem(item, index + 1);
    }
  );
}

function serializeItem(item: IVideo, order: number): object {
  return {
    description: item.description,
    enclosure: {
      "@length": item.videoDetails.contentLength || 0,
      "@type": item.videoDetails.contentType || "unknown",
      "@url": `${VIDEO_DIRECT_BASE_URL}${item.id}.mp4`
    },
    guid: {
      "#text": item.id,
      "@isPermalink": false
    },
    "itunes:author": item.channelId,
    "itunes:duration": item.duration,
    "itunes:explicit": "no",
    "itunes:image": {
      "@href": item.thumbnails.high.url
    },
    "itunes:order": order,
    "itunes:subtitle": item.title,
    "itunes:summary": item.description,
    link: `${VIDEO_BASE_URL}${item.id}`,
    pubDate: item.publishedAt.toISOString(),
    title: item.title
  };
}

async function getVideoDetails(videoId: string): Promise<IVideoDetails> {
  const response: any = await head(`${VIDEO_DIRECT_BASE_URL}${videoId}.mp4`);
  return {
    contentLength: response["content-length"],
    contentType: response["content-type"]
  };
}
