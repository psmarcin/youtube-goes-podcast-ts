import Boom from "boom";
import { head } from "request-promise-native";
import config from './../config'
import {
  IItem,
  IVideo,
  IVideoDetails
} from "./Ivideo";
import request from "./request";
import { IFeedOptions } from './../Iroutes'
const VIDEO_BASE_URL = `https://youtube.com/watch?v=`;
const VIDEO_DIRECT_BASE_URL = `${config.apiUrl}video/`

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
      },
    });
  } catch (error) {
    throw Boom.boomify(error);
  }
  const items: IItem[] = response.items.filter((i: any) => i.id.videoId);
  try {
    const [videos, details]: [IVideo[], IItem[]] = await Promise.all([
      getFileDetails(items),
      getDetails(items.map((item) => item.id.videoId)),
    ]);
    return merge(videos, details);
  } catch (error) {
    throw Boom.boomify(error);
  }
}

async function getFileDetails(items: IItem[]): Promise<IVideo[]> {
  return Promise.all(items.map(async (item: IItem): Promise<IVideo> => {
    const snippet = item.snippet;
    return {
      channelId: snippet.channelId,
      description: snippet.description,
      duration: "0",
      id: item.id.videoId,
      publishedAt: new Date(snippet.publishedAt),
      thumbnails: snippet.thumbnails,
      title: snippet.title,
      videoDetails: item.id.videoId ? await getVideoDetails(item.id.videoId) : {
        contentLength: 0,
        contentType: ''
      },
    };
  }));
}

async function getDetails(videoIds: string[]): Promise<IItem[]> {
  const response: any = await request.get("videos", {
    qs: {
      id: videoIds.join(","),
      part: "snippet,contentDetails",
    },
  });
  return response.items;
}

function merge(videos: IVideo[], details: IItem[]): IVideo[] {
  return videos.map((video) => {
    const videoDetails: (IItem | undefined) = details.find((detail) => detail.id.videoId === video.id);
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
  return items.map((item: IVideo, index: number): object => {
    return serializeItem(item, index + 1);
  });
}

function serializeItem(item: IVideo, order: number): object {
  return {
    "guid": {
      "@isPermalink": false,
      "#text": item.id,
    },
    "title": item.title,
    "link": `${VIDEO_BASE_URL}${item.id}`,
    "description": item.description,
    "pubDate": item.publishedAt.toISOString(),
    "enclosure": {
      "@url": `${VIDEO_DIRECT_BASE_URL}${item.id}`,
      "@type": item.videoDetails.contentType || "unknown",
      "@length": item.videoDetails.contentLength || 0,
    },
    "itunes:author": item.channelId,
    "itunes:subtitle": item.title,
    "itunes:summary": item.description,
    "itunes:image": {
      "@href": item.thumbnails.high.url,
    },
    "itunes:duration": item.duration,
    "itunes:explicit": "no",
    "itunes:order": order,
  };
}

async function getVideoDetails(videoId: string): Promise<IVideoDetails> {
  const response: any = await head(`${VIDEO_DIRECT_BASE_URL}${videoId}`);
  return {
    contentLength: response["content-length"],
    contentType: response["content-type"],
  };
}
