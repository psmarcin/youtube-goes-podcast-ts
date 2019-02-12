import Boom from 'boom'
import xml, { XMLElementOrXMLNode } from "xmlbuilder";
import { head } from "request-promise-native";
import request from './request'
import { IVideo } from './Ivideo'

const VIDEO_BASE_URL = `https://youtube.com/watch?v=`
const VIDEO_DIRECT_BASE_URL = `https://podcasts.psmarcin.me/video/`
const TRANSCODE_BASE_URL = `https://transcoder.plex.tv/photo?height=1500&minSize=1&width=1500&upscale=1&url=`

export async function getAll(channelId: string): Promise<IVideo.Video[]> {
  let response: any;
  try {
    response = await request.get('search', {
      qs: {
        part: 'snippet',
        channelId,
      }
    })
  } catch (error) {
    throw Boom.boomify(error)
  }
  const items: IVideo.Item[] = response.items
  try {
    const [videos, details]: [IVideo.Video[], IVideo.IItem[]] = await Promise.all([
      getFileDetails(items),
      getDetails(items.map(item => item.id.videoId))
    ])
    return merge(videos, details)
  } catch (error) {
    throw Boom.boomify(error)
  }
}

async function getFileDetails(items: IVideo.Item[]): Promise<IVideo.Video[]> {
  return Promise.all(items.map(async (item: IVideo.Item): Promise<IVideo.Video> => {
    const snippet = item.snippet
    const videoDetails = await getVideoDetails(item.id.videoId)
    return {
      id: item.id.videoId,
      channelId: snippet.channelId,
      description: snippet.description,
      publishedAt: new Date(snippet.publishedAt),
      thumbnails: snippet.thumbnails,
      title: snippet.title,
      videoDetails,
      duration: "0"
    }
  }))
}

async function getDetails(videoIds: string[]): Promise<IVideo.IItem[]> {
  const response: any = await request.get('videos', {
    qs: {
      part: 'snippet,contentDetails',
      id: videoIds.join(','),
    }
  })
  return response.items
}

function merge(videos: IVideo.Video[], details: IVideo.IItem[]): IVideo.Video[] {
  return videos.map((video) => {
    const videoDetails: (IVideo.IItem | undefined) = details.find((detail) => detail.id === video.id)
    if (!videoDetails) {
      return video
    }
    video.thumbnails = videoDetails.snippet.thumbnails
    video.description = videoDetails.snippet.description
    video.duration = videoDetails.contentDetails.duration
    return video
  })
}

export function serialize(items: IVideo.Video[]): object[] {
  return items.map((item: IVideo.Video, index: number): object => {
    return serializeItem(item, index + 1)
  })
}

function serializeItem(item: IVideo.Video, order: number): object {
  return {
    guid: {
      '@isPermalink': false,
      '#text': item.id
    },
    title: item.title,
    link: `${VIDEO_BASE_URL}${item.id}`,
    description: item.description,
    pubDate: item.publishedAt.toISOString(),
    enclosure: {
      '@url': `${VIDEO_DIRECT_BASE_URL}${item.id}`,
      '@type': item.videoDetails.contentType || 'unknown',
      '@length': item.videoDetails.contentLength || 0
    },
    'itunes:author': item.channelId,
    'itunes:subtitle': item.title,
    'itunes:summary': item.description,
    'itunes:image': {
      '@href': item.thumbnails.high.url
    },
    'itunes:duration': item.duration,
    'itunes:explicit': 'no',
    'itunes:order': order
  }
}


async function getVideoDetails(videoId: string): Promise<IVideo.VideoDetails> {
  const response: any = await head(`${VIDEO_DIRECT_BASE_URL}${videoId}`)
  return {
    contentLength: response['content-length'],
    contentType: response['content-type']
  }
}
