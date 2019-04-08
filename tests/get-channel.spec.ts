import xmlParser from "fast-xml-parser";
import nock from "nock";
import supertest from "supertest";
import { app } from "./../src/app";

describe("GET /feed/channel/:channelId", () => {
  beforeAll(() => {
    const videoRegex = /video.*.mp4$/;
    nock("http://localhost:8080")
      .get(videoRegex)
      .reply(200)
      .persist();
    nock("http://localhost:8080")
      .head(videoRegex)
      .reply(200)
      .persist();
  });

  it("should get 5 elements in response", async () => {
    const channelId = "UCmrlqFIK_QQCsr3FRHa3OKw";
    const response = await supertest(app)
      .get(`/feed/channel/${channelId}`)
      .expect(200);
    const xml = xmlParser.parse(response.text);

    expect(xml).toHaveProperty(
      "rss.channel",
      expect.objectContaining({
        generator: "youtube-goes-podcast@v1.0.0",
        "itunes:author": "flaretv",
        "itunes:category": "",
        "itunes:explicit": "clean",
        "itunes:image": "",
        "itunes:type": "episodic",
        language: "us",
        ttl: 60
      })
    );

    expect(xml).toHaveProperty(
      "rss.channel.item",
      expect.arrayContaining([
        expect.objectContaining({
          "itunes:duration": 0,
          "itunes:explicit": "no",
          "itunes:image": ""
        })
      ])
    );
  });
});
