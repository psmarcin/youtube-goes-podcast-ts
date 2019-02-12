import Joi, { ValidationResult } from 'joi'
import request from 'request'
import requestPromis from 'request-promise-native'
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
const itags = ['140']


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

const allowedKeys = ['range', 'if-range', 'transfer-encoding', 'content-range', 'accept-ranges']
const headerKeysBlacklist = ['host']
const filterHeaders = (headers:any) => {
  headerKeysBlacklist.forEach((key)=>{
    headers[key] = undefined
  })
  return headers
}

router.use('/video/:videoId', (req: Request, res: Response) => {
  try {
    
    ytdl.getInfo(req.params.videoId, async (err, info)=>{
      if(err) throw err
      const format = info.formats.find((f)=>(itags.includes(f.itag)))
      if(!format){
        throw Boom.badRequest(`Can't find audio format`)
      }
      log.info(filterHeaders(req.headers), `[VIDEO] Headers`)
      const headOptions = {
        method: 'HEAD',
        uri: format.url,
        headers: filterHeaders(req.headers)
      }
      const response = await requestPromis(headOptions)
      log.info(response, `response`)
      // res.status(206)
      
      if(req.method === 'GET'){
        const options = {
          method: 'GET',
          uri: format.url,
          headers: filterHeaders(req.headers)
        }
        return request(options).on('response', (r)=>{
          log.info(r.statusCode.toString(), `[VIDEO] response`)
          res.status(r.statusCode)
          res.set(r.headers)
          log.info(r.headers, `[VIDEO] Head response`)
          // res.end()
        })
        .pipe(res, { end: true })
      } else {
        res.set(response)
        res.end()
      }
    })
  } catch (error) {
    throw Boom.boomify(error)
  }
})

export default router
