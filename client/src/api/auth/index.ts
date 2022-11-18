import { apiRequest } from '@api/index';
import { ILoginResponse, IUserResponse, LoginInput, SignUpInput } from '@api/types';
import { generateRandomUsername } from '@utils/helpers';

export const registerUser = async (values: SignUpInput) => {
  return apiRequest<SignUpInput, IUserResponse>('post', 'register', {}, values);
};

export const loginUser = async (values: LoginInput) => {
  return apiRequest<LoginInput, ILoginResponse>('post', 'login', {}, values);
};

export const createDemoUser = () => {
  const password = 'Test123%';
  return registerUser({
    username: generateRandomUsername(),
    email: generateRandomUsername() + '@demo.com',
    password,
    confirmPassword: password,
  });
};
