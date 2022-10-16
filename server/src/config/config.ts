import { core } from '@config/env/core';
// load configurations

// set the node environment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

// handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('[script]', err);
});

// extend the base configuration in core.js with environment specific configuration
export { core as config };

console.info(`_______________________________(${process.env.NODE_ENV} environment)_______________________________`);
