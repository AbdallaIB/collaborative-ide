import { AuthController } from '@controllers/auth';
import { Router } from 'express';
import { loginSchema, signUpSchema } from '@shared/schemas/user';
import { validate } from '@middlewares/validator';

const index = (router: Router, authController: AuthController) => {
  // Register user route
  router.post('/register', validate(signUpSchema), authController.registerUser);

  // Login user route
  router.post('/login', validate(loginSchema), authController.loginUser);
};

export default index;
