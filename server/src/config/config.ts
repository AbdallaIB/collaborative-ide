import { core } from '@config/env/core';
import { config } from 'dotenv';
import { resolve } from 'path';
import { extend } from 'underscore';

// load environment variables from .env file
config({ path: resolve('.env') });

// set the node environment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

// handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('[script]', err);
});

// extend the base configuration in core.js with environment specific configuration
const env = extend(
  core,
  // eslint-disable-next-line global-require
  require(`./env/${process.env.NODE_ENV}`) || {},
);
export { env as config };

console.info(`_______________________________(${process.env.NODE_ENV} environment)_______________________________`);
