import { config } from '@config/config';
import mongoose, { ConnectOptions } from 'mongoose';

const moduleName = '[database]';
import loggerHandler from '@utils/logger';
const logger = loggerHandler(moduleName);
const getDatabaseUrl = () => {
  if (config.db_config.replicaHost) {
    return `${config.db_config.driver}://${config.db_config.host}:${config.db_config.port}/${config.db_config.dbName},${config.db_config.replicaHost}:${config.db_config.replicaPort}`;
  }
  if (process.env.NODE_ENV === 'development') {
    return `${config.db.driver}://${config.db.host}:${config.db.port}/${config.db.name}`;
  }
  return `${config.db.driver}://${process.env.DB_USER}:${process.env.DB_PASS}@${config.db.host}/${config.db.name}?retryWrites=true&w=majority&ssl=true`;
};

const dbURI = getDatabaseUrl();

const connectWithRetry = () => {
  return mongoose.connect(dbURI, config.db_options as ConnectOptions, (err) => {
    if (err) {
      logger.error('Mongoose failed to connect', err);
    }
  });
};

connectWithRetry();

mongoose.connection.on('connected', () => {
  logger.info(`.mongoose.connected, connection has been established with ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
  logger.error('.mongoose.error, connection to mongo failed', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('.mongoose.disconnected connection closed - retrying in 5 sec');
  setTimeout(connectWithRetry, 5000);
});

export default connectWithRetry;
