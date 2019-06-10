import {Injectable} from "brit";
import {Application} from "express";
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
import * as winston from "winston";
import * as bodyParser from 'body-parser';
import {CoreModuleConfig} from "./core-module-config";
import {LoggerCreator} from "./logger-creator";
import {Options as MorganOptions} from "morgan";

@Injectable()
export class CoreModule {

  readonly rootDir: string = process.cwd();
  readonly app: Application = express();
  readonly log: winston.Logger;

  constructor(
    readonly config: CoreModuleConfig,
    private _loggerCreator: LoggerCreator
  ) {
    this.log = this._loggerCreator.create(this.rootDir);
    this._initialLogs();
    this._setupCORS();
    this._setupHelmet();
    this._setupMorgan();
    this._setupCookieParser();
    this._bodyParser();
    this.log.info('Core functionality set up');
  }

  private _initialLogs() {
    this.log.info(`Starting Web App: ${this.config.name}`);
    this.log.info('Logger created');
    this.log.info(`Environment: ${WEB_APP_ENVIRONMENT}`);
    this.log.info(`Root directory: ${this.rootDir}`);
  }

  private _setupCORS() {
    this.app.use(
      cors(this.config.CORS)
    );
  }

  private _setupHelmet() {
    this.app.use(
      helmet(this.config.helmet)
    );
  }

  private _setupMorgan() {
    const config = this.config.morgan;
    let morganOptions: MorganOptions = config.options || {};
    if (config.streamToLogger) {
      morganOptions.stream = {
        write: message => this.log.info(
          message
            .replace(/\[\d{1,3}m|\n$/g, '')
        )
      };
    }
    this.app.use(
      morgan(
        config.format as string,
        morganOptions
      )
    );
  }

  private _setupCookieParser() {
    if (!this.config.cookieParser) {
      return this.app.use(cookieParser());
    }
    this.app.use(
      cookieParser(
        this.config.cookieParser.secret,
        this.config.cookieParser.options
      )
    );
  }

  private _bodyParser() {
    this.app.use(
      bodyParser.json(
        this.config.bodyParser
      )
    );
  }

  runServer() {
    this.app.listen(
      this.config.port
    );
    this.log.info(`App listening on port ${this.config.port}`);
  }

}

export enum WebAppEnvironment {
  Dev = 'development',
  Prod = 'production'
}

export const WEB_APP_ENVIRONMENT
  = (process.env.environment || WebAppEnvironment.Dev)
  .trim()
  .toLowerCase();
