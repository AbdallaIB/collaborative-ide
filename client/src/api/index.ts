import Axios, { AxiosRequestHeaders } from 'axios';

export async function apiRequest<D = Record<string, unknown>, R = unknown>(
  method: 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch',
  path: string,
  params?: any,
  input?: D,
  options?: AxiosRequestHeaders,
) {
  const res = await Axios.request<R>({
    url: `${process.env.BASE_API_URL}/${path}`,
    method: method,
    data: input,
    params: params,
    headers: options,
  });
  return res.data;
}

export const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('token') || 'null';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${JSON.parse(accessToken)}`,
  };
  return headers;
};
