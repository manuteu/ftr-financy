import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';
import { useAuthStore } from '@/stores/auth';


export default function Router() {
  const { isAuthenticated } = useAuthStore();
  const availableRoutes = isAuthenticated ? PrivateRoutes : PublicRoutes;

  const appRouter = createBrowserRouter(availableRoutes);

  return (
    <RouterProvider
      router={appRouter}
    />
  );
}
