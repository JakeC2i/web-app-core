import {Response} from "express";
import {CoreModule} from "./core-module";
import {Logger} from "winston";
import {Injectable} from "brit";

@Injectable()
export class ErrorHandler {

  private readonly _handlers: ErrorHandler.ErrorHandlerMiddleware[] = [];
  private readonly _log: Logger;

  constructor(
    private _core: CoreModule
  ) {
    this._log = this._core.log;
  }

  addHandler(handler: ErrorHandler.ErrorHandlerMiddleware) {
    if (!this._handlers.includes(handler)) {
      this._handlers.push(handler);
    }
  }

  handleApiError(error: Error, res: Response): void {

    // TODO generate ID and add it to the response
    this._log.error(error.message);

    const defaultHandling: ErrorHandler.HandledError = {
      name: 'Internal Server Error',
      message: 'Unknown error',
      httpCode: 500
    };

    const respondWithError = (handled: ErrorHandler.HandledError) => {
      const code = (handled.httpCode || defaultHandling.httpCode) as number;
      res.status(code).json({
        name: handled.name,
        message: handled.message
      });
    };

    for (let i=0; i<this._handlers.length; i++) {
      const maybeHandled = this._handlers[i](error);
      if (maybeHandled) {
        return respondWithError(maybeHandled);
      }
    }
    return respondWithError(defaultHandling);
  }
}

export namespace ErrorHandler {

  export interface HandledError {
    name: string;
    message: string;
    httpCode?: number;
  }

  export type ErrorHandlerMiddleware = (error: Error) => (HandledError | void);

}
