import create from 'zustand';

type DarkModeStore = {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

const isBrowserDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches || false;

const getLocalStorage = (key: string) => JSON.parse(localStorage.getItem(key) || 'null');
const setLocalStorage = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value));

const useDarkModeStore = create<DarkModeStore>((set, get) => ({
  darkMode: getLocalStorage('darkMode') ?? isBrowserDarkMode,
  setDarkMode: (darkMode: boolean) => {
    setLocalStorage('darkMode', darkMode);
    set((state) => ({
      ...state,
      darkMode,
    }));
  },
}));

export default useDarkModeStore;
