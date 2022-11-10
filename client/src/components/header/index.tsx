import useAuthStore from '@lib/stores/auth';
import useToast from '@lib/hooks/useToast';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DummyProfile from '@assets/dummyProfile.svg';
import useDarkModeStore from '@lib/stores/darkMode';

const Header = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const { darkMode, setDarkMode } = useDarkModeStore();
  const { logout, authUser } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  const logoutUser = () => {
    logout();
    success('Successfully logged out');
    navigate('/');
  };

  return (
    <header className="flex flex-row justify-between w-full px-6 border-solid border-b border-gray-200 dark:border-main_dark">
      <Link to="/">
        <div className="my-2 flex flex-row justify-center items-center gap-2">
          <div className="w-9 p-0.5 rounded-lg flex justify-center items-center">
            <i className="bx bx-terminal text-4xl text-main"></i>
          </div>
        </div>
      </Link>

      <nav className="flex flex-row items-center gap-5">
        <div className="p-2 hover:bg-gray-100 dark:hover:bg-gray-500 text-main_dark dark:text-main_side rounded-lg">
          <button type="button" onClick={() => setDarkMode(!darkMode)} className="text-[1.5rem] flex items-center">
            {darkMode ? <i className="bx bx-sun"></i> : <i className="bx bx-moon"></i>}
          </button>
        </div>

        {authUser && (
          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center relative">
            <button onClick={() => setShowMenu(!showMenu)}>
              <img src={DummyProfile} alt="profile"></img>
            </button>
            <div
              style={{ display: showMenu ? 'flex' : 'none' }}
              className="absolute right-0 z-10 mt-20 origin-top-right rounded-md shadow-lg bg-gray-100"
            >
              <div className="py-1 whitespace-nowrap" role="none">
                <button
                  onClick={logoutUser}
                  className="text-main_dark hover:bg-gray-200 block px-4 py-2 text-sm text-center w-full"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
