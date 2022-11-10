import { IUser } from '@api/types';
import create from 'zustand';

type AuthStore = {
  token: string;
  authUser: IUser | null;
  logout: () => void;
  authenticate: (user: IUser, token: string) => void;
};

const getLocalStorage = (key: string) => JSON.parse(localStorage.getItem(key) || 'null');
const setLocalStorage = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value));

const useAuthStore = create<AuthStore>((set, get) => ({
  token: getLocalStorage('token') || '',
  authUser: getLocalStorage('user') || null,
  logout: () => {
    localStorage.clear();
    set((state) => ({
      ...state,
      token: '',
      authUser: null,
    }));
  },
  authenticate: (user: IUser, token: string) => {
    setLocalStorage('token', token);
    setLocalStorage('user', user);
    set((state) => ({
      ...state,
      token,
      authUser: user,
    }));
  },
}));

export default useAuthStore;
