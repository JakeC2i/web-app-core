import {Injectable} from "brit";
import * as morgan from "morgan";
import * as bodyParser from 'body-parser';
import {CorsOptions} from "cors";
import {IHelmetConfiguration} from "helmet";
import {CookieParseOptions} from "cookie-parser";
import * as winston from "winston";

@Injectable()
export class CoreModuleConfig {

  name: string = 'Unnamed Web App';
  port: number = 3000;

  logger: {
    custom?: winston.Logger;
    consoleTransportOptions: any;
    logToFile: {
      enabled: boolean;
      directory?: string;
      dailyRotateOptions: any;
    }
  } = {
    consoleTransportOptions: {
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    },
    logToFile: {
      enabled: false,
      dailyRotateOptions: {
        filename: 'app-%DATE%.log',
        dirname: '',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '180d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }
    }
  };

  CORS: CorsOptions = {
    origin: true,
    credentials: true
  };

  helmet?: IHelmetConfiguration;

  morgan: {
    format: string | morgan.FormatFn;
    options?: morgan.Options;
    streamToLogger: boolean
  } = {
    format: 'dev',
    streamToLogger: false
  };

  cookieParser?: {
    secret?: string;
    options: CookieParseOptions;
  };

  bodyParser?: bodyParser.OptionsJson;
}
