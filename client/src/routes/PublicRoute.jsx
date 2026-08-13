import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = ({ redirectAuthenticated = false }) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <main className="grid min-h-screen place-items-center bg-surface-muted"><Loader /></main>;
  if (redirectAuthenticated && isAuthenticated) return <Navigate to="/app" replace />;

  return <Outlet />;
};

export default PublicRoute;
