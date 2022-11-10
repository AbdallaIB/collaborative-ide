import { verifyJwt } from '@utils/jwt';
import { statusCodes } from '@utils/constants';
import loggerHandler from '@utils/logger';
const moduleName = '[auth] ';
const logger = loggerHandler(moduleName);
import { Request, Response, NextFunction } from 'express';

export type User = {
  uId: string;
  username: string;
};

export type RequestWithUser = Request & { user: User };

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = getToken(req);
  const authData = verifyJwt(bearerToken);
  if (!authData) {
    logger.error('[validateToken][error]', 'Token has been Expired');
    return res.status(statusCodes.UNAUTHORIZED).json({
      message: 'Session has been expired',
    });
  }
  logger.info('[validateToken][authData]', authData);

  req['user'] = authData;
  next();
};

const getToken = (req: Request) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1]
      ? req.headers.authorization.split(' ')[1]
      : req.headers.authorization.split(' ')[2];
  }
  return null;
};
