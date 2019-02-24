import Boom from "boom";
import xml, { XMLElementOrXMLNode } from "xmlbuilder";
import { IChannel, IItem, IRoot, ISerializedChannel, ISnippet } from "./Ichannel";
import request from "./request";

const CHANNEL_BASE_URL = `https://youtube.com/channel/`;
const TRANSCODE_BASE_URL = `https://transcoder.plex.tv/photo?height=1500&minSize=1&width=1500&upscale=1&url=`;

export async function get(channelId: string): Promise<IChannel> {
  let response: any;

  try {
    response = await request.get("channels", {
      qs: {
        id: channelId,
        part: "snippet",
      },
    });
  } catch (error) {
    throw Boom.boomify(error);
  }

  const resp: IRoot = response;

  if (!resp.items || !resp.items.length) {
    throw Boom.badRequest(`Can't find channel with id ${channelId}`);
  }

  const snippet: ISnippet = resp.items[0].snippet;

  const channel: IChannel = {
    country: snippet.country,
    customUrl: snippet.customUrl,
    description: snippet.description,
    id: channelId,
    publishedAt: new Date(snippet.publishedAt),
    thumbnails: {
      default: snippet.thumbnails.default.url,
      high: snippet.thumbnails.high.url,
      medium: snippet.thumbnails.medium.url,
    },
    title: snippet.title,
  };

  return channel;
}

export async function getAll(query: string): Promise<IItem[]> {
  let response: any;
  try {
    response = await request.get("search", {
      qs: {
        fields: "items(id,snippet(channelId,channelTitle,thumbnails/default,title))",
        order: "viewCount",
        part: "snippet",
        q: query,
        type: "channel",
      },
    });
  } catch (error) {
    throw Boom.boomify(error);
  }
  return response.items;
}

export function serializeJSON(channels: IItem[]): ISerializedChannel[] {
  return channels.map((channel) => {
    return {
      channelId: channel.id.channelId,
      thumbnail: channel.snippet.thumbnails.default.url,
      title: channel.snippet.title,
    };
  });
}

export function serialize(channel: IChannel, items: object[]): XMLElementOrXMLNode {
  const xmlString: XMLElementOrXMLNode = xml.create({
    rss: {
      "@version": "2.0",
      "@xmlns:atom": "http://www.w3.org/2005/Atom",
      "@xmlns:content": "http://purl.org/rss/1.0/modules/content/",
      "@xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
      "@xmlns:media": "http://search.yahoo.com/mrss/",
      "@xmlns:sy": "http://purl.org/rss/1.0/modules/syndication/",
      "channel": {
        "itunes:subtitle": {
          "#text": channel.title,
        },
        "link": {
          "#text": `${CHANNEL_BASE_URL}/${channel.id}`,
        },
        "pubDate": {
          "#text": channel.publishedAt && channel.publishedAt.toISOString(),
        },
        "language": {
          "#text": channel.country ? channel.country.toLocaleLowerCase() : 'en',
        },
        "lastBuildDate": {
          "#text": channel.publishedAt && channel.publishedAt.toISOString(),
        },
        "copyright": {
          "#text": `© ${new Date().getFullYear()}`,
        },
        "media:copyright": {
          "#text": `© ${new Date().getFullYear()}`,
        },
        "description": {
          "#text": channel.description,
        },
        "itunes:summary": {
          "#text": channel.description,
        },
        "generator": {
          "#text": "youtube-goes-podcast@v1.0.0",
        },
        "image": {
          url: {
            "#text": `${TRANSCODE_BASE_URL}${channel.thumbnails.high}`,
          },
          title: {
            "#text": channel.title,
          },
          link: {
            "#text": `${CHANNEL_BASE_URL}${channel.id}`,
          },
          width: {
            "#text": 800,
          },
          height: {
            "#text": 800,
          },
        },
        "media:thumbnail": {
          "@href": `${TRANSCODE_BASE_URL}${channel.thumbnails.high}`,
          "@url": `${TRANSCODE_BASE_URL}${channel.thumbnails.high}`,
        },
        "itunes:author": {
          "#text": channel.customUrl,
        },
        "itunes:type": {
          "#text": "episodic",
        },
        "itunes:category": {
          "@text": "News &amp; Politics",
        },
        "media:category": {
          "@scheme": "http://www.itunes.com/dtds/podcast-1.0.dtd",
          "@text": "News &amp; Politics",
        },
        "itunes:image": {
          "@href": channel.thumbnails.high,
        },
        "itunes:explicit": {
          "#text": "clean",
        },
        "itunes:owner": {
          "itunes:name": channel.customUrl,
        },
        "item": items,
        "title": {
          "#text": channel.title,
        },
        "ttl": {
          "#text": "60",
        },
      },
    },
  },
  { version: "1.0", encoding: "UTF-8", standalone: true },
  {},
  { headless: false });

  return xmlString;
}
