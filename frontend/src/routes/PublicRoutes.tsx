import { Navigate } from 'react-router'
import PublicLayout from './PublicLayout';
import SignUp from '@/pages/auth/sign-up';
import SignIn from '@/pages/auth/sign-in';

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  label: string;
  children?: RouteConfig[];
}

const publicRoutes: RouteConfig[] = [
  {
    path: '/',
    element: <PublicLayout />,
    label: 'Public',
    children: [
      { path: '/', element: <SignIn />, label: 'SignIn' },
      { path: '/signup', element: <SignUp />, label: 'SignUp' },
      { path: '*', element: <Navigate to="/" />, label: 'Not Found' },
    ],
  },
]

export default publicRoutes
