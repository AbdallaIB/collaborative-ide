import loggerHandler from '@utils/logger';
const moduleName = '[auth] ';
const logger = loggerHandler(moduleName);
import { Request, Response } from 'express';
import { statusCodes } from '@utils/constants';
import { createUser, findUser, signToken } from '@services/user';
import { genSalt, hash } from 'bcryptjs';

interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginInput {
  username: string;
  password: string;
}

export class AuthController {
  public async registerUser(req: Request<{}, {}, CreateUserInput>, res: Response) {
    logger.info('[registerUser][body]', req.body);
    const { username, email, password } = req.body;
    try {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      const user = await createUser({
        email,
        username,
        password: hashedPassword,
      });

      // Create an Access Token
      const accessToken = await signToken(user);

      res.status(statusCodes.OK).json({
        user: { uId: user._id, username: user.username },
        accessToken,
      });
    } catch (err: any) {
      logger.error('[registerUser][Error]', err.message);
      return res.status(statusCodes.BAD_REQUEST).json({ message: err.message });
    }
  }

  public async loginUser(req: Request<{}, {}, LoginInput>, res: Response) {
    logger.info('[loginUser][body]', req.body);
    const { username, password } = req.body;
    try {
      // Get the user from the collection
      const user = await findUser({ username });

      // Check if user exist and password is correct
      if (!user || !(await user.comparePasswords(user.password, password))) {
        return res.status(statusCodes.BAD_REQUEST).json({
          message: 'Invalid username or password',
        });
      }

      // Create an Access Token
      const accessToken = await signToken(user);

      // Send Access Token
      res.status(statusCodes.OK).json({
        accessToken,
        user: { uId: user._id, username: user.username },
      });
    } catch (e: any) {
      logger.error('[loginUser][Error]', e.message);
      return res.status(statusCodes.BAD_REQUEST).json({ message: e.message });
    }
  }
}
