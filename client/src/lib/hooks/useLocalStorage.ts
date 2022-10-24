import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export type ReturnType<T> = [T, Dispatch<SetStateAction<T>>];

export const useLocalStorage = <T>(key: string, initialValue?: T): ReturnType<T> => {
  const [state, setState] = useState<T>(() => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    if (state) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.log('useLocalStorage[err]', error);
      }
    }
  }, [state, key]);

  return [state, setState];
};
