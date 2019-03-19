import { error404Handler, error5xxHandler } from "./errors";
import { Request, Response, NextFunction } from "express";
import Boom from "boom";

const defaultErrorPayload = {
  error: "Internal Server Error",
  message: "An internal server error occurred",
  statusCode: 500
};

describe("middleware module", () => {
  describe("error404Handler", () => {
    it("should set status and json payload", () => {
      const res: any = {};
      res.status = jest.fn(() => res);
      res.json = jest.fn(() => res);
      error404Handler({} as Request, res as Response, {} as NextFunction);
      expect(res.status).toBeCalledTimes(1);
      expect(res.json).toBeCalledTimes(1);
    });
  });

  describe("error5xxHandler", () => {
    it("should set status and json payload from boom error", () => {
      const error = Boom.badRequest("empty body");
      const res: any = {};
      res.status = jest.fn(() => res);
      res.json = jest.fn(() => res);
      error5xxHandler(
        error,
        {} as Request,
        res as Response,
        {} as NextFunction
      );
      expect(res.status).toBeCalledTimes(1);
      expect(res.json).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(error.output.statusCode);
      expect(res.json).toBeCalledWith(error.output.payload);
    });

    it("should set status and json payload from native error", () => {
      const error = new Error("empty native body");
      const res: any = {};
      res.status = jest.fn(() => res);
      res.json = jest.fn(() => res);
      error5xxHandler(
        error,
        {} as Request,
        res as Response,
        {} as NextFunction
      );
      expect(res.status).toBeCalledTimes(1);
      expect(res.json).toBeCalledTimes(1);
      expect(res.status).toBeCalledWith(defaultErrorPayload.statusCode);
      expect(res.json).toBeCalledWith(defaultErrorPayload);
    });
  });
});
