import {Injectable} from "brit";
import {CoreModuleConfig} from "./core-module-config";
import * as winston from "winston";
import * as path from "path";
const dailyRotateFile = require('winston-daily-rotate-file');

@Injectable()
export class LoggerCreator {

  constructor(
    private _config: CoreModuleConfig
  ) {}

  create(rootDir: string): winston.Logger {
    const config = this._config.logger;
    if (config.custom) {
      return config.custom;
    }
    const consoleTransport
      = new winston.transports.Console(
        this._config.logger.consoleTransportOptions
      );
    if (config.logToFile.enabled) {
      const fileConfig = config.logToFile;
      if (fileConfig.directory) {
        fileConfig.dailyRotateOptions
          .dirname = fileConfig.directory;
      }
      fileConfig.dailyRotateOptions.dirname
        = path.join(rootDir, fileConfig.dailyRotateOptions.dirname);
      return winston.createLogger({
        transports: [
          consoleTransport,
          new (dailyRotateFile)(
            fileConfig.dailyRotateOptions
          )
        ]
      });
    }
    return winston.createLogger({
      transports: [
        consoleTransport
      ]
    });
  }
}
