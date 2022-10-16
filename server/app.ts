import { config } from 'dotenv';
import * as path from 'path';
import { app } from './src/config/express';
const moduleName = '[app] ';
import * as express from 'express';
import loggerHandler from './src/utils/logger';
const logger = loggerHandler(moduleName);
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';
import '@config/config';
import connectWithRetry from '@config/database';
import { Server } from 'socket.io';
import socketHandler from 'src/socket/socket';

// init dotenv
config({ path: path.resolve('.env') });

app.use(express.static(__dirname, { dotfiles: 'allow' }));

if (process.env.SECURE_ENABLED === 'true') {
  // Certificate
  const privateKey = fs.readFileSync(process.env.SSL_CERTS_PRIVATE_KEY!, 'utf8');
  const certificate = fs.readFileSync(process.env.SSL_CERTS_CERTIFICATE!, 'utf8');
  const ca = fs.readFileSync(process.env.SSL_CERTS_CHAIN!, 'utf8');

  const options = {
    key: privateKey,
    cert: certificate,
    ca,
  };
  const httpsServer = https.createServer(options, app);

  httpsServer.listen(process.env.HTTPS_PORT);
  logger.info('Https server is listening at', process.env.HTTPS_PORT);

  // init database
  connectWithRetry();

  // Make global object of socket.io
  const socket = new Server(httpsServer, {
    cors: {
      origin: process.env.SOCKET_CLIENT_ORIGIN,
      methods: ['GET', 'POST'],
    },
  });

  socketHandler(socket);
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(process.env.PORT);
  logger.info('Http server is listening at', process.env.PORT);

  // init database
  connectWithRetry();

  // Make global object of socket.io
  const socket = new Server(httpServer, {
    cors: {
      origin: process.env.SOCKET_CLIENT_ORIGIN,
      methods: ['GET', 'POST'],
    },
  });

  socketHandler(socket);
}
