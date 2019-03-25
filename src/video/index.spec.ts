import nock from "nock";
import { getRedirectLink } from "./index";

nock.disableNetConnect();

describe("video", () => {
  describe("get redirection link", () => {
    const videoId: string = "NtQkz0aRDe8";

    beforeAll(() => {
      nock("https://www.youtube.com")
        .get("/watch")
        .query(() => true)
        .replyWithFile(200, __dirname + "/__mock__/video.html");
      nock("https://www.youtube.com")
        .get("/get_video_info")
        .query(() => true)
        .replyWithFile(200, __dirname + "/__mock__/video-info.txt");
      nock("https://www.youtube.com")
        .get("/yts/jsbin/player_ias-vflGPko2h/en_US/base.js")
        .query(() => true)
        .replyWithFile(200, __dirname + "/__mock__/player.js");
    });

    it("should get redirection link", async () => {
      const link: string = await getRedirectLink(videoId);
      expect(link).toBe(
        "https://r4---sn-f5f7lne6.googlevideo.com/videoplayback?gir=yes&clen=9665628&mn=sn-f5f7lne6%2Csn-4g5e6nze&mt=1553520323&mv=m&ei=b9eYXNy3Eo7u7gTciZ7wCg&ms=au%2Conr&requiressl=yes&mime=audio%2Fmp4&txp=5532432&pl=13&itag=140&mm=31%2C26&keepalive=yes&c=WEB&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&ipbits=0&signature=19A7C990F0B708A32C92203B3EC41BF705CCDA67.3EB34CDFBBC25BDCE4C6FF55E2DD212331EFE9F6&key=yt6&ip=89.65.245.94&lmt=1550182498369207&dur=597.193&expire=1553542095&source=youtube&initcwndbps=1560000&fvip=4&id=o-APGyMx3Rq0zpvgIYYTaX0uP554VM2iVBDuxMZfM0E7QB&ratebypass=yes"
      );
    });
  });
});
