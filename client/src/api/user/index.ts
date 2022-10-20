import { apiRequest } from '@api/index';
import { IUserResponse } from '@api/types';

export const getMyUser = async (accessToken: string) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  return await apiRequest<undefined, IUserResponse>('get', 'user', {}, undefined, headers);
};
