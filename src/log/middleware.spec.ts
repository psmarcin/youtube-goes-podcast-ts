import log from "./middleware";
import { Request, Response } from "express";

describe("log middleware", () => {
  it("should log message and go to next function", () => {
    const req = {
      headers: {},
      method: "GET",
      path: "/"
    };
    const nextFn = jest.fn();
    log(req as Request, {} as Response, nextFn);
    log(req as Request, {} as Response, nextFn);
    expect(nextFn).toBeCalledTimes(2);
  });
});
