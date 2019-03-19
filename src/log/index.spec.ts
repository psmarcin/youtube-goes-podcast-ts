import log from "./index";

describe("log module", () => {
  it("should has implemented info method", () => {
    log.info({}, "should log this on info level");
  });
  it("should has implemented error method", () => {
    log.error({}, "should log this on error level");
  });
  it("should has implemented debug method", () => {
    log.debug({}, "should log this on debug level");
  });
  it("should has implemented warn method", () => {
    log.warn({}, "should log this on warn level");
  });
  it("should has implemented fatal method", () => {
    log.fatal({}, "should log this on fatal level");
  });
  it("should has implemented trace method", () => {
    log.trace({}, "should log this on trace level");
  });
});
