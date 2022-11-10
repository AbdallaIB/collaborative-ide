import { app } from '@config/express';
const moduleName = '[app] ';
import * as express from 'express';
import loggerHandler from '@utils/logger';
const logger = loggerHandler(moduleName);
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';
import '@config/config';
import connectWithRetry from '@config/database';
import { initWebsocket } from 'src/websocket';

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

  // init Yjs websocket
  initWebsocket(httpsServer);
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(process.env.PORT);
  logger.info('Http server is listening at', process.env.PORT);

  // init database
  connectWithRetry();

  // init Yjs websocket
  initWebsocket(httpServer);
}
