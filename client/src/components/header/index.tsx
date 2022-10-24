import useAuthStore from '@lib/stores/auth';
import useToast from '@lib/hooks/useToast';
import IconButton from '@components/shared/icon-button';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const { logout } = useAuthStore();

  const logoutUser = async () => {
    logout();
    success('Successfully logged out');
    navigate('/');
  };

  return (
    <header className="border-b border-palette-lighter w-full bg-white">
      <div className="flex flex-row items-center justify-between mx-auto max-w-6xl px-6 pb-2 pt-3">
        <div className="flex flex-row items-center justify-between gap-4">
          <Link to="/">
            <div>
              <i className="bx bx-terminal opacity-50 text-5xl"></i>
            </div>
          </Link>
        </div>
        <div className="group relative">
          <IconButton
            onClick={logoutUser}
            backgroundColor="gray"
            iconClass="bx bx-log-out opacity-75 text-xl"
          ></IconButton>
          <span className="absolute -left-1/4 top-full translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
            Logout
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
