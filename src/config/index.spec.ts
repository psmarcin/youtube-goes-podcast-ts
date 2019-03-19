import config from "./index";

describe("config module", () => {
  it("should load default port", () => {
    expect(config.port).toEqual("8080");
  });
});
