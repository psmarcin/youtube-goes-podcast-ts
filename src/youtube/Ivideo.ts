export interface IPageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface IId {
  kind: string;
  videoId: string;
}

export interface IDefault {
  url: string;
  width: number;
  height: number;
}

export interface IMedium {
  url: string;
  width: number;
  height: number;
}

export interface IHigh {
  url: string;
  width: number;
  height: number;
}

export interface IThumbnails {
  default: IDefault;
  medium: IMedium;
  high: IHigh;
}

export interface ISnippet {
  publishedAt: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: IThumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
}

export interface IItem {
  kind: string;
  etag: string;
  id: IId;
  snippet: ISnippet;
}

export interface IVideoDetails {
  contentLength: number;
  contentType: string;
}

export interface IRootObject {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: IPageInfo;
  items: IItem[];
}

export interface IVideo {
  id: string;
  publishedAt: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: IThumbnails;
  videoDetails: IVideoDetails;
  duration: string;
}

type JSON = IVideoDetails;

export interface IPageInfo {
  resultsPerPage: number;
  totalResults: number;
}

export interface IItem {
  contentDetails: IContentDetails;
  etag: string;
  id: IId;
  kind: string;
  player: IPlayer;
  snippet: ISnippet;
  statistics: IStatistics;
}

export interface ISnippet {
  categoryId: string;
  channelId: string;
  channelTitle: string;
  defaultAudioLanguage: string;
  defaultLanguage: string;
  description: string;
  liveBroadcastContent: string;
  localized: ILocalized;
  publishedAt: Date;
  tags: string[];
  thumbnails: IThumbnails;
  title: string;
}

export interface IThumbnails {
  default: IDefault;
  high: IHigh;
  maxres: IMaxres;
  medium: IMedium;
  standard: IStandard;
}

export interface IDefault {
  height: number;
  url: string;
  width: number;
}

export interface IMedium {
  height: number;
  url: string;
  width: number;
}

export interface IHigh {
  height: number;
  url: string;
  width: number;
}

export interface IStandard {
  height: number;
  url: string;
  width: number;
}

export interface IMaxres {
  height: number;
  url: string;
  width: number;
}

export interface ILocalized {
  description: string;
  title: string;
}

export interface IContentDetails {
  caption: string;
  definition: string;
  dimension: string;
  duration: string;
  licensedContent: boolean;
  projection: string;
}

export interface IStatistics {
  commentCount: string;
  dislikeCount: string;
  favoriteCount: string;
  likeCount: string;
  viewCount: string;
}

export interface IPlayer {
  embedHtml: string;
}
