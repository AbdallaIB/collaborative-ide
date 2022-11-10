import { apiRequest } from '@api/index';
import { ILoginResponse, IUserResponse, LoginInput, SignUpInput } from '@api/types';
import { generateUsername } from 'unique-username-generator';

export const registerUser = async (values: SignUpInput) => {
  return apiRequest<SignUpInput, IUserResponse>('post', 'register', {}, values);
};

export const loginUser = async (values: LoginInput) => {
  return apiRequest<LoginInput, ILoginResponse>('post', 'login', {}, values);
};

export const createDemoUser = () => {
  const password = 'Test123%';
  return registerUser({
    username: generateUsername(),
    email: generateUsername() + '@demo.com',
    password,
    confirmPassword: password,
  });
};
