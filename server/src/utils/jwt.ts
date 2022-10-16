import { config } from '@config/config';
import { sign, verify } from 'jsonwebtoken';

export const signJwt = (payload: Object) => {
  return sign(payload, config.TOKEN_SECRET_KEY ? config.TOKEN_SECRET_KEY : 'secretkey', {
    expiresIn: config.TOKEN_EXPIRE_TIME_SEC,
  });
};

export const verifyJwt = <T>(token: string): T | null => {
  try {
    return verify(token, config.TOKEN_SECRET_KEY ? config.TOKEN_SECRET_KEY : 'secretkey') as T;
  } catch (error) {
    return null;
  }
};
