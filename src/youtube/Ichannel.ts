
  export interface IPageInfo {
    totalResults: number;
    resultsPerPage: number;
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

  export interface ILocalized {
    title: string;
    description: string;
  }

  export interface ISnippet {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: Date;
    thumbnails: IThumbnails;
    localized: ILocalized;
    country: string;
  }
  export interface IID {
    channelId: string;
  }
  export interface IItem {
    kind: string;
    etag: string;
    id: IID;
    snippet: ISnippet;
  }

  export interface IRoot {
    kind: string;
    etag: string;
    pageInfo: IPageInfo;
    items: IItem[];
  }

  export interface IResponse {
    body: IRoot;
  }

  export interface IChannel {
    id: string;
    title: string;
    description: string;
    customUrl: string;
    publishedAt: Date;
    thumbnails: {
      default: string,
      medium: string,
      high: string,
    };
    country: string;
  }

  export interface ISerializedChannel {
    title: string;
    channelId: string;
    thumbnail: string;
  }
