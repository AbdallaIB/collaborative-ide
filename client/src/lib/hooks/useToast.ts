import { toast } from 'react-hot-toast';

const useToast = () => {
  const promise = (promise: Promise<unknown>, msgs: { loading: string; error: string; success: string }) => {
    return toast.promise(promise, msgs);
  };
  const success = (msg: string) => {
    return toast.success(msg);
  };
  const error = (msg: string) => {
    return toast.error(msg);
  };

  const errorMessage = (err: any) => {
    const resMessage =
      (err.response && err.response.data && err.response.data.message) || err.message || err.toString() || err[0].msg;
       if (resMessage === 'Session has been expired') {
      const url = window.location.protocol + '//' + window.location.host + '/login';
      localStorage.clear();
      window.location.href = url;
    }
    return error(resMessage);
  };

  return {
    promise,
    success,
    error,
    errorMessage,
  };
};
export default useToast;
