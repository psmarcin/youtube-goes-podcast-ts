import Joi, {ValidationResult} from 'joi'
import Boom from 'boom'
import { Request, Response, Router, NextFunction } from "express";
import { get, addChildren, serialize } from "./youtube/channel";
import {getAll, serialize as videoSerialize} from "./youtube/video";
import {IChannel} from './youtube/Ichannel'
import {IVideo} from './youtube/Ivideo'
import log from './log'
const router = Router({})
const startedAt = new Date()


router.get('/',(req:Request, res:Response):void=>{
  res.json({
    up: startedAt.toUTCString()
  })
})

router.get('/feed/channel/:channelId', async (req: Request, res:Response, next: NextFunction):Promise<void>=>{
  const channelIdSchema: Joi.StringSchema = Joi.string().required()
  log.info(`[SERVER] ChannleID: ${req.params.channelId}`)
  const validationResult: ValidationResult<string> = Joi.validate(req.params.channelId, channelIdSchema)

  if (validationResult.error){
    return next(Boom.badRequest('ChannelId is not valid'))
  }
  try {
    const channelId = validationResult.value
    const channel: IChannel.Channel = await get(channelId)
    const videos: IVideo.Video[] = await getAll(channelId)
    const serializedChannel = serialize(channel)
    const serializedVideos = videoSerialize(videos)
    const root = addChildren({ parent: serializedChannel, children: serializedVideos})
    res.header({ 'content-type': 'application/xml' }).send(`<?xml version="1.0" encoding="UTF-8"?> ${root.end({pretty:true})}`)
  } catch (error) {
    next(error)
  }
})


export default router
