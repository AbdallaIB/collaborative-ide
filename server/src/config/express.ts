const moduleName = '[express]';
import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import loggerHandler from '@utils/logger';
import router from 'src/routes';
const logger = loggerHandler(moduleName);
import { Request, Response, NextFunction } from 'express';

const expressApp = express();

// Set Request Parsing
expressApp.use(express.json({ limit: '10kb' }));
expressApp.use(express.urlencoded({ extended: false }));

// Cors
const origin = process.env.NODE_ENV !== 'production' ? '*' : process.env.REACT_CLIENT_ORIGIN;
const corsOptions = {
  origin: origin,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
expressApp.use(cors(corsOptions));

// Static resources
expressApp.use(express.static(path.resolve('public')));
expressApp.use(express.static(path.resolve('uploads')));

expressApp.use((req: Request, res: Response, next: NextFunction) => {
  // Allowed Origin and Methods, and Headers

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'HEAD, PUT, POST, GET, OPTIONS, DELETE');
  res.header('Access-Control-Allow-Headers', 'origin, content-type, Authorization, x-access-token');
  if (req.method === 'OPTIONS') {
    logger.error('[Express][Invalid Request][Method]', req.method);
    return res.status(405).send().end();
  }
  next();
});

expressApp.get('/', (req, res) => {
  res.sendFile(`${path.resolve('public')}/index.html`);
});

// Routes namespace
expressApp.use('/api/v1', router);

// Global Error Handler
expressApp.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export const app = expressApp;
