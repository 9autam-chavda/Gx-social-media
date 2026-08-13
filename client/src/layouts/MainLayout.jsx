import { Outlet, useLocation } from 'react-router-dom';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const getMainClassName = (pathname) => {
  const isMessages = pathname.startsWith('/app/messages');

  return [
    'min-w-0 flex-1 pb-20 lg:pb-6',
    isMessages
      ? 'px-0 pt-0 sm:px-3 sm:pt-3 lg:px-4 lg:pt-4'
      : 'px-2 pt-3 sm:px-6 sm:pt-4 lg:px-6 lg:pt-6',
  ].join(' ');
};

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface-muted text-ink">
      <Navbar />
      <div className="mx-auto flex max-w-[1480px]">
        <Sidebar />
        <main className={getMainClassName(location.pathname)}>
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default MainLayout;
