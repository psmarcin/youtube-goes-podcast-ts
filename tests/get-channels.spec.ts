import supertest from "supertest";
import { app } from "./../src/app";

describe("GET /channels", () => {
  it("should get 5 elements in response", async () => {
    const response = await supertest(app)
      .get("/channels?q=PewDiePie")
      .expect(200);
    expect(response.body).toHaveLength(5);
    expect(response).toHaveProperty(
      "body",
      expect.arrayContaining([
        expect.objectContaining({
          channelId: expect.any(String),
          thumbnail: expect.any(String),
          title: expect.any(String)
        })
      ])
    );
  });

  it("should get 0 elements in response", async () => {
    const response = await supertest(app)
      .get("/channels?q=12hk4j12k4h12h3kj123h123jkb1n23jkb12k3jk1b23kjl1")
      .expect(200);
    expect(response.body).toHaveLength(0);
    expect(response).toHaveProperty("body", []);
  });

  it("should get top 5 elements in response for no query", async () => {
    const response = await supertest(app)
      .get("/channels")
      .expect(200);
    expect(response.body).toHaveLength(5);
    expect(response).toHaveProperty(
      "body",
      expect.arrayContaining([
        expect.objectContaining({
          channelId: expect.any(String),
          thumbnail: expect.any(String),
          title: expect.any(String)
        })
      ])
    );
  });
});
