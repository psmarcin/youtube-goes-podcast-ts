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

    it.skip("should get redirection link", async () => {
      const link: string = await getRedirectLink(videoId);
      expect(link).toBe(
        "https://r4---sn-f5f7lne6.googlevideo.com/videoplayback?clen=9665628&itag=140&txp=5532432&mime=audio%2Fmp4&gir=yes&key=yt6&lmt=1550182498369207&ipbits=0&dur=597.193&fvip=4&expire=1953547240&id=o-AASobwTXRER8wGgq6A3z3XTARJyMCj2XAvOUriK8zDLh&pl=13&signature=81545D8F4D7A5B05D8911D1CFA6F87C40F69477C.D10C2447C8F33ECC82A70205C433EAB9484CF5C1&mm=31%2C26&mn=sn-f5f7lne6%2Csn-4g5ednsk&ip=89.65.245.94&requiressl=yes&ms=au%2Conr&mt=1553525563&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&mv=m&keepalive=yes&ei=iOuYXOzVC-Hk7ASKkI7oCA&c=WEB&initcwndbps=1473750&source=youtube&ratebypass=yes"
      );
    });
  });
});
