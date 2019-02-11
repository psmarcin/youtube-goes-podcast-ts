import xml, { XMLElementOrXMLNode } from "xmlbuilder";
import { head } from "request-promise-native";
import request from './request'
import {IVideo} from './Ivideo'

const VIDEO_BASE_URL = `https://youtube.com/watch?v=`
const VIDEO_DIRECT_BASE_URL = `https://youtube-goes-podcast-video.herokuapp.com/`

export async function getAll(channelId: string):Promise<IVideo.Video[]>{
  const response: any = await request.get('search', {
    qs: {
      part: 'snippet',
      channelId,
    }
  })
  const items: IVideo.Item[] = response.items
  const videos: IVideo.Video[] = await Promise.all(items.map(async (item: IVideo.Item): Promise<IVideo.Video>=>{
    const snippet = item.snippet
    const videoDetails = await getVideoDetails(item.id.videoId)
    return {
      id: item.id.videoId,
      channelId: snippet.channelId,
      description: snippet.description,
      publishedAt: new Date(snippet.publishedAt),
      thumbnails: snippet.thumbnails,
      title:snippet.title,
      videoDetails
    }
  }))
  return videos

}

export function serialize(items: IVideo.Video[]): XMLElementOrXMLNode[]{
  return items.map((item: IVideo.Video, index:number):XMLElementOrXMLNode=>{
    return serializeItem(item, index+1)
  })
}

function serializeItem(item: IVideo.Video, order: number): XMLElementOrXMLNode {
  return xml.begin().ele({
    item: {
      guid:{
        '@isPermalink': false,
        '#text': item.id
      },
      title: item.title,
      link: `${VIDEO_BASE_URL}${item.id}`,
      description: item.description,
      pubDate: item.publishedAt.toUTCString(),
      enclosure: {
        '@url': `${VIDEO_DIRECT_BASE_URL}${item.id}`,
        '@type': item.videoDetails.contentType,
        '@length': item.videoDetails.contentLength
      }, // TODO: add length
      'itunes:author': item.channelId,
      'itunes:subtitle': item.title,
      'itunes:summary': item.description,
      'itunes:image': {
        '@href': item.thumbnails.high.url
      },
      'itunes:duration': '10000', // TODO: get correct value
      'itunes:explicit': 'no',
      'itunes:order': order
    }
  })
}


async function getVideoDetails(videoId: string): Promise<IVideo.VideoDetails>{
  const response: any = await head(`${VIDEO_DIRECT_BASE_URL}${videoId}`)
  return {
    contentLength: response['content-length'],
    contentType: response['content-type']
  }
}
