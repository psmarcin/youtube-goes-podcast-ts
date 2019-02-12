export declare module IVideo {

  export interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
  }

  export interface Id {
    kind: string;
    videoId: string;
  }

  export interface Default {
    url: string;
    width: number;
    height: number;
  }

  export interface Medium {
    url: string;
    width: number;
    height: number;
  }

  export interface High {
    url: string;
    width: number;
    height: number;
  }

  export interface Thumbnails {
    default: Default;
    medium: Medium;
    high: High;
  }

  export interface Snippet {
    publishedAt: Date;
    channelId: string;
    title: string;
    description: string;
    thumbnails: IThumbnails;
    channelTitle: string;
    liveBroadcastContent: string;
  }

  export interface Item {
    kind: string;
    etag: string;
    id: Id;
    snippet: Snippet;
  }

  export interface VideoDetails {
    contentLength: number,
    contentType: string,
  }

  export interface RootObject {
    kind: string;
    etag: string;
    nextPageToken: string;
    regionCode: string;
    pageInfo: PageInfo;
    items: Item[];
  }

  export interface Video{
    id: string,
    publishedAt: Date,
    channelId: string,
    title: string,
    description: string,
    thumbnails: IThumbnails,
    videoDetails: VideoDetails,
    duration: string
  }

  type JSON = IVideoDetails

export interface IVideoDetails {
  etag: string;
  items: IItem[];
  kind: string;
  pageInfo: IPageInfo;
}

export interface IPageInfo {
  resultsPerPage: number;
  totalResults: number;
}

export interface IItem {
  contentDetails: IContentDetails;
  etag: string;
  id: string;
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
  publishedAt: string;
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

}
