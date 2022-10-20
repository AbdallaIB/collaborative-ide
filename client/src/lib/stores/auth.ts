import { IUser } from '@api/types';
import create from 'zustand';

type Store = {
  token: string;
  authUser: IUser | null;
  requestLoading: boolean;
  setRequestLoading: (isLoading: boolean) => void;
  logout: () => void;
  authenticate: (user: IUser, token: string) => void;
  getToken: () => string;
  getUser: () => IUser | null;
};

const useStore = create<Store>((set, get) => ({
  token: '',
  authUser: null,
  requestLoading: false,
  setRequestLoading: (isLoading) => set((state) => ({ ...state, requestLoading: isLoading })),
  logout: () => {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    set((state) => ({
      ...state,
      token: '',
      authUser: null,
    }));
  },
  authenticate: (user: IUser, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set((state) => ({
      ...state,
      token,
      authUser: user,
    }));
  },
  getToken: () => {
    return get().token || localStorage.getItem('token') || '';
  },
  getUser: () => {
    const user = localStorage.getItem('user');
    return get().authUser || JSON.parse(user || 'null') || null;
  },
}));

export default useStore;
