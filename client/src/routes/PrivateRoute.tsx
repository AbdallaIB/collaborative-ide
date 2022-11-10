import { Navigate, RouteProps, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import useAuthStore from '@lib/stores/auth';

const PrivateRoute = ({ children }: RouteProps) => {
  const location = useLocation();
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} />;
  }

  return children as JSX.Element;
};

export default observer(PrivateRoute);
