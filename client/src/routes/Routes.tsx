import Code from '@pages/code';
import IndexPage from '@pages/index';
import Login from '@pages/login';
import Page404 from '@pages/page404';
import SignUp from '@pages/signup';
import { PathRouteProps, Routes as Switch, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import RestrictedRoute from './RestrictedRoute';

export enum RouteType {
  PUBLIC,
  PRIVATE,
  RESTRICTED,
}
interface AppRoute extends PathRouteProps {
  type?: RouteType;
}
export const AppRoutes: AppRoute[] = [
  // Restricted Routes
  //   {
  //     type: RouteType.PRIVATE,
  //     path: 'dashboard',
  //     children: <Dashboard />,
  //   },
  // Private Routes
  {
    type: RouteType.PRIVATE,
    path: '',
    children: <IndexPage />,
  },
  // Public Routes
  {
    type: RouteType.PUBLIC,
    path: 'signup',
    children: <SignUp />,
  },
  {
    type: RouteType.PUBLIC,
    path: 'login',
    children: <Login />,
  },
  {
    type: RouteType.PUBLIC,
    path: 'code/:id',
    children: <Code />,
  },
];

const Routes = () => {
  return (
    <Switch>
      {AppRoutes.map((r) => {
        const { type } = r;
        if (type === RouteType.PRIVATE) {
          return <Route key={`${r.path}`} path={`/${r.path}`} element={<PrivateRoute>{r.children}</PrivateRoute>} />;
        }
        if (type === RouteType.RESTRICTED) {
          return (
            <Route key={`${r.path}`} path={`/${r.path}`} element={<RestrictedRoute>{r.children}</RestrictedRoute>} />
          );
        }

        return <Route key={`${r.path}`} path={`/${r.path}`} element={r.children} />;
      })}
      <Route path="*" element={<Page404 />} />
    </Switch>
  );
};

export default Routes;
