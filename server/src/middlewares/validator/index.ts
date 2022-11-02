import { Request, Response, NextFunction } from 'express';
import { statusCodes } from '@utils/constants';
import { ObjectSchema } from 'yup';

export const validate = (schema: ObjectSchema<{}>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // throws an error if not valid
    await schema.validate(req.body);
    next();
  } catch (err: any) {
    return res.status(statusCodes.BAD_REQUEST).json({
      errors: err.errors,
    });
  }
};
