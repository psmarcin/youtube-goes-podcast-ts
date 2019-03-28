import supertest from "supertest";
import { app } from "./../src/app";

describe("GET /video", () => {
  it("should get redirect link", done => {
    supertest(app)
      .get("/video/NtQkz0aRDe8.mp4")
      .expect(302)
      .end(done);
  });
  it("should get redirect link to old route", done => {
    supertest(app)
      .get("/video/NtQkz0aRDe8")
      .expect(302)
      .end(done);
  });

  it("should get return nothing", done => {
    supertest(app)
      .get("/video/NOT_VALID_VIDEO_ID.mp4")
      .expect(400)
      .end(done);
  });
});
