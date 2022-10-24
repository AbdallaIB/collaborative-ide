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

  return {
    promise,
    success,
    error,
  };
};
export default useToast;
