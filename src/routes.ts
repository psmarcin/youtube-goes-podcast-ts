import Joi, { ValidationResult } from 'joi'
import request from 'request'
import Boom from 'boom'
import { Request, Response, Router, NextFunction } from "express";
import { get, serialize } from "./youtube/channel";
import { getAll, serialize as videoSerialize } from "./youtube/video";
import { IChannel } from './youtube/Ichannel'
import { IVideo } from './youtube/Ivideo'
import log from './log'
import ytdl from 'ytdl-core'

const router = Router({})
const startedAt = new Date()


router.get('/', (req: Request, res: Response): void => {
  res.json({
    up: startedAt.toUTCString()
  })
})

router.get('/feed/channel/:channelId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const channelIdSchema: Joi.StringSchema = Joi.string().required()
  log.info(`[SERVER] ChannleID: ${req.params.channelId}`)
  const validationResult: ValidationResult<string> = Joi.validate(req.params.channelId, channelIdSchema)

  if (validationResult.error) {
    return next(Boom.badRequest('ChannelId is not valid'))
  }
  try {
    const channelId = validationResult.value
    const channel: IChannel.Channel = await get(channelId)
    const videos: IVideo.Video[] = await getAll(channelId)
    const serializedVideos = videoSerialize(videos)
    const serializedChannel = serialize(channel, serializedVideos)
    res.header({ 'content-type': 'application/xml' }).send(serializedChannel.end({ pretty: true }))
  } catch (error) {
    next(error)
  }
})

const allowedKeys = ['range', 'if-range', 'transfer-encoding']
const filterHeaders = (headers:any) => {
  return Object.keys(headers)
    .filter(e => allowedKeys.includes(e.toLocaleLowerCase()))
    .reduce((acc:any, key) => {
      acc[key] = headers[key]
      return acc
    }, {})
}

router.use('/video/:videoId', (req: Request, res: Response) => {
  ytdl.getInfo(req.params.videoId, (err, info)=>{
    if(err) throw err
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const options = {
      method: req.method,
      uri: audioFormats[0].url,
      headers: filterHeaders(req.headers)
    }
    request(options).pipe(res)
  })
})

export default router
