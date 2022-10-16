import { transports, format, createLogger, addColors } from 'winston';

const { combine, timestamp, printf, colorize, prettyPrint } = format;

const levels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'white',
    debug: 'blue',
  },
};

const customFormat = combine(
  timestamp(
    // time format
    { format: 'DD-MM-YYYY HH:mm:ss.SSS' },
  ),
  colorize({ all: true }),
  // format.align(),
  prettyPrint(),
  printf((info) => `${info.timestamp} ${process.pid}/tic-tac-toe ${info.level}: ${info.message}`),
);

const logger = createLogger({
  levels: levels.levels,
  format: customFormat,
  transports: [new transports.Console()],
});

addColors(levels.colors);

const loggerHandler = (moduleName) => {
  return {
    debug(message, data?) {
      logger.debug(message + (data ? ` ${JSON.stringify(data)}` : ''));
    },
    info: (message, data?) => {
      message = `${moduleName}${message}`;
      logger.info(message + (data ? ` ${JSON.stringify(data)}` : ''));
    },
    warn(message, data?) {
      logger.warn(message + (data ? ` ${JSON.stringify(data)}` : ''));
    },
    error(message, data?) {
      logger.error(message + (data ? ` ${JSON.stringify(data)}` : ''));
    },
  };
};

export default loggerHandler;
