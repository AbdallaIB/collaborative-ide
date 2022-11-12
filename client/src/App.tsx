import Header from '@components/header';
import Routes from '@routes/Routes';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { PageTitles } from '@utils/helpers';
import './App.css';
import useDarkModeStore from '@lib/stores/darkMode';
import theme from '@styles/shared/theme';

const App = () => {
  const { pathname } = useLocation();
  const { darkMode } = useDarkModeStore();

  useEffect(() => {
    const path: keyof typeof PageTitles = pathname as any;
    document.title = path.startsWith('/code') ? PageTitles['/code'] : PageTitles[path] ?? 'Collaborative Ide';
  }, [pathname]);

  return (
    <div className={'mainContainer ' + (darkMode ? 'dark' : '')}>
      <div className="flex h-full flex-col w-full bg-main_side dark:bg-main_black text-main_side dark:text-gray-200 dark:hover:text-white">
        {!pathname.startsWith('/code') && <Header></Header>}
        <main className="h-full">
          <Routes />
        </main>
      </div>
      <Toaster
        toastOptions={{
          style: { backgroundColor: theme.colors.main_side, color: theme.colors.main_dark },
          position: 'top-center',
        }}
      />
    </div>
  );
};

export default App;
