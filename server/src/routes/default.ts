const moduleName = '[default]';
import * as path from 'path';
import loggerHandler from '@utils/logger';
import { Request, Response, Router } from 'express';
const logger = loggerHandler(moduleName);

const defaultRouter = (router: Router) => {
  // DEFAULT_ROUTES
  const operationNotAllowed = (res: Response, type: string) => {
    logger.error('[operationNotAllowed]', type);
    return res.status(404).send('404 Not Found');
  };

  router.get('/', (req: Request, res: Response) => {
    res.sendFile(path.resolve('public/index.html'));
  });

  // this must be the last line
  router
    .route('/*')
    .get((req: Request, res: Response) => {
      operationNotAllowed(res, 'GET');
    })
    .post((req: Request, res: Response) => {
      operationNotAllowed(res, 'POST');
    })
    .delete((req: Request, res: Response) => {
      console.log(req.url, req.query);
      operationNotAllowed(res, 'DELETE');
    })
    .put((req: Request, res: Response) => {
      operationNotAllowed(res, 'PUT');
    });
};

export default defaultRouter;
