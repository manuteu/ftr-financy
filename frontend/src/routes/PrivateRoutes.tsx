import Dashboard from '@/pages/dashboard';
import { Navigate } from 'react-router';
import PrivateLayout from './PrivateLayout';
import Profile from '@/pages/profile';
import Transactions from '@/pages/transactions';
import Categories from '@/pages/categories';

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  label: string;
  children?: RouteConfig[];
}

const privateRoutes: RouteConfig[] = [
  {
    path: '/',
    element: <PrivateLayout />,
    label: 'Private',
    children: [
      { path: '/', element: <Dashboard />, label: 'Dashboard' },
      {
        path: '/profile',
        element: <Profile />,
        label: 'Profile',
      },
      {
        path: '/transactions',
        element: <Transactions />,
        label: 'Transações',
      },
      {
        path: '/categories',
        element: <Categories />,
        label: 'Categorias',
      },
      {
        path: '*',
        element: <Navigate to="/" />,
        label: 'Not Found',
      },
    ],
  },
]

export default privateRoutes
