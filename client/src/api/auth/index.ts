import { apiRequest } from '@api/index';
import { ILoginResponse, IUserResponse } from '@api/types';
import { LoginFormValues } from '@components/login/LoginForm';
import { SignUpFormValues } from '@components/signup/SignUpForm';

export const registerUser = async (values: SignUpFormValues) => {
  return await apiRequest<SignUpFormValues, IUserResponse>('post', 'register', {}, values);
};

export const loginUser = async (values: LoginFormValues) => {
  return await apiRequest<LoginFormValues, ILoginResponse>('post', 'login', {}, values);
};
