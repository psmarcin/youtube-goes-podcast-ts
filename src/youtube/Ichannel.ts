

export declare module IChannel {

  export interface PageInfo {
    totalResults: number;
    resultsPerPage: number;
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

  export interface Localized {
    title: string;
    description: string;
  }

  export interface Snippet {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: Date;
    thumbnails: Thumbnails;
    localized: Localized;
    country: string;
  }
  export interface ID {
    channelId: string
  }
  export interface Item {
    kind: string;
    etag: string;
    id: ID;
    snippet: Snippet;
  }

  export interface Root {
    kind: string;
    etag: string;
    pageInfo: PageInfo;
    items: Item[];
  }

  export interface Response{
    body: Root
  }

  export interface Channel {
    id: string,
    title: string,
    description: string,
    customUrl: string,
    publishedAt: Date,
    thumbnails: {
      default: string,
      medium: string,
      high: string,
    },
    country: string
  }

  export interface SerializedChannel {
    title: string,
    channelId: string,
    thumbnail: string
  }
}
