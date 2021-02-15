import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as config from 'config';


export class AppLogger implements LoggerService {
  private logger: winston.Logger;
  constructor() {
    this.initializeLogger();
  }
  initializeLogger() {
    this.logger = winston.createLogger({
      level: config.get<string>('app.logger.level') || 'debug',
      defaultMeta: { service: 'utu' },
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        // prettyJson,
      ),
      transports: [
        new winston.transports.Console(),
      ],
    });
  }
  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  log(message: string) {
    this.logger.info(message);
  }
}
