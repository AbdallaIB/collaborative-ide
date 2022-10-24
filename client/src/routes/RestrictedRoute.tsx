import { RouteProps, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import useAuthStore from '@lib/stores/auth';

const RestrictedRoute = ({ children }: RouteProps) => {
  const { getUser } = useAuthStore();

  if (!getUser()) {
    return <Navigate to="/" />;
  }
  return children as JSX.Element;
};

export default observer(RestrictedRoute);
