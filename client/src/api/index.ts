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
