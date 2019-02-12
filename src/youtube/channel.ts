import request from './request'
import { IChannel } from './Ichannel'
import { IVideo } from './Ivideo'
import Boom from 'boom'
import xml, { XMLElementOrXMLNode } from "xmlbuilder";

const CHANNEL_BASE_URL = `https://youtube.com/channel/`
const TRANSCODE_BASE_URL = `https://transcoder.plex.tv/photo?height=1500&minSize=1&width=1500&upscale=1&url=`

export async function get(channelId: string): Promise<IChannel.Channel> {
  let response: any;

  try {
    response = await request.get('channels', {
      qs: {
        part: 'snippet',
        id: channelId
      }
    })
  } catch (error) {
    throw Boom.boomify(error)
  }

  const resp: IChannel.Root = response

  if (!resp.items || !resp.items.length) {
    throw Boom.badRequest(`Can't find channel with id ${channelId}`)
  }

  const snippet: IChannel.Snippet = resp.items[0].snippet

  const channel: IChannel.Channel = {
    id: channelId,
    customUrl: snippet.customUrl,
    description: snippet.description,
    publishedAt: new Date(snippet.publishedAt),
    thumbnails: {
      default: snippet.thumbnails.default.url,
      medium: snippet.thumbnails.medium.url,
      high: snippet.thumbnails.high.url,
    },
    title: snippet.title,
    country: snippet.country
  }

  return channel

}

export function serialize(channel: IChannel.Channel, items: object[]): XMLElementOrXMLNode {
  const xmlString: XMLElementOrXMLNode = xml.create({
    rss: {
      '@xmlns:atom': "http://www.w3.org/2005/Atom",
      '@xmlns:itunes': "http://www.itunes.com/dtds/podcast-1.0.dtd",
      '@xmlns:media': "http://search.yahoo.com/mrss/",
      '@xmlns:sy': "http://purl.org/rss/1.0/modules/syndication/",
      '@xmlns:content': "http://purl.org/rss/1.0/modules/content/",
      '@version': "2.0",
      channel: {
        title: {
          '#text': channel.title,
        },
        'itunes:subtitle': {
          '#text': channel.title,
        },
        link: {
          '#text': `${CHANNEL_BASE_URL}/${channel.id}`
        },
        pubDate: {
          '#text': channel.publishedAt.toISOString()
        },
        lastBuildDate: {
          '#text': channel.publishedAt.toISOString()
        },
        ttl: {
          '#text': '60'
        },
        language: {
          '#text': channel.country.toLocaleLowerCase()
        },
        copyright: {
          '#text': `© ${new Date().getFullYear()}`
        },
        'media:copyright': {
          '#text': `© ${new Date().getFullYear()}`
        },
        description: {
          '#text': channel.description
        },
        'itunes:summary': {
          '#text': channel.description
        },
        generator: {
          '#text': 'youtube-goes-podcast@v1.0.0'
        },
        image: {
          url: {
            '#text': `${TRANSCODE_BASE_URL}${channel.thumbnails.high}`
          },
          title: {
            '#text': channel.title
          },
          link: {
            '#text': `${CHANNEL_BASE_URL}${channel.id}`
          },
          width: {
            '#text': 800
          },
          height: {
            '#text': 800
          }
        },
        'media:thumbnail': {
          '@href': `${TRANSCODE_BASE_URL}${channel.thumbnails.high}`,
          '@url': `${TRANSCODE_BASE_URL}${channel.thumbnails.high}`
        },
        'itunes:author': {
          '#text': channel.customUrl
        },
        'itunes:type': {
          '#text': 'episodic'
        },
        'itunes:category': {
          '@text': 'News &amp; Politics'
        },
        'media:category': {
          '@scheme': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
          '@text': 'News &amp; Politics'
        },
        'itunes:image': {
          '@href': channel.thumbnails.high
        },
        'itunes:explicit': {
          '#text': 'clean'
        },
        'itunes:owner': {
          'itunes:name': channel.customUrl
        },
        item: items
      },
    }
  }, 
  { version: '1.0', encoding: 'UTF-8', standalone: true }, 
  {}, 
  { headless: false })

  return xmlString
}
