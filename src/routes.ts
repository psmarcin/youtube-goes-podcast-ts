import Boom from "boom";
import { NextFunction, Request, Response, Router } from "express";
import Joi, { JoiObject, ValidationResult } from "joi";
import log from "./log";
import { IFeedOptions } from "./routes.interface";
import { getRedirectLink } from "./video/index";
import {
  get,
  getAll as getAllChannels,
  serialize,
  serializeJSON
} from "./youtube/channel";
import { IChannel } from "./youtube/channel.interface";
import { getAll, serialize as videoSerialize } from "./youtube/video";
import { IVideo } from "./youtube/video.interface";
const router = Router({});
const startedAt = new Date();

const feedOptionsSchema: JoiObject = Joi.object().keys({
  channelId: Joi.string().required(),
  count: Joi.number()
    .optional()
    .default(10)
    .max(50)
    .min(1),
  q: Joi.string().optional()
});

router.get(
  "/",
  (req: Request, res: Response): void => {
    res.json({
      up: startedAt.toUTCString()
    });
  }
);

router.get(
  "/channels",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q } = req.query;
      const channels = await getAllChannels(q);
      const serialized = serializeJSON(channels);
      res.json(serialized);
    } catch (error) {
      next(Boom.badRequest(error.message));
    }
  }
);

router.get(
  "/feed/channel/:channelId",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    log.info(`[SERVER] ChannelID: ${req.params.channelId}`);
    const options: IFeedOptions = {
      channelId: req.params.channelId,
      count: req.query.count,
      q: req.query.search
    };
    const validationResult: ValidationResult<IFeedOptions> = Joi.validate(
      options,
      feedOptionsSchema
    );

    if (validationResult.error) {
      return next(Boom.badRequest("ChannelId is not valid"));
    }
    try {
      const options = validationResult.value;
      const channel: IChannel = await get(options.channelId);
      const videos: IVideo[] = await getAll(options);
      const serializedVideos = videoSerialize(videos);
      const serializedChannel = serialize(channel, serializedVideos);
      res
        .header({ "content-type": "application/xml" })
        .send(serializedChannel.end({ pretty: true }));
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/video/:videoId.mp4",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { videoId } = req.params;
      if (!videoId) {
        throw Boom.badRequest("VideoId is required!");
      }
      const url = await getRedirectLink(videoId);
      res.status(302);
      res.redirect(url);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
