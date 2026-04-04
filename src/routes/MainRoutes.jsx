import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import { PrivateRoute } from '../components/PrivateRoute';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const DashboardBanners = Loadable(lazy(() => import('pages/dashboard/banners')));
const DashboardBranches = Loadable(lazy(() => import('pages/dashboard/branches')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: (
        <PrivateRoute>
          <DashboardDefault />
        </PrivateRoute>
      )
    },
    {
      path: '/products',
      element: (
        <PrivateRoute>
          <DashboardDefault />
        </PrivateRoute>
      )
    },
    {
      path: '/banners',
      element: (
        <PrivateRoute>
          <DashboardBanners />
        </PrivateRoute>
      )
    },
    {
      path: '/branches',
      element: (
        <PrivateRoute>
          <DashboardBranches />
        </PrivateRoute>
      )
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
