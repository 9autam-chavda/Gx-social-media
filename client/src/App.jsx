import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Loader from './components/common/Loader';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import PublicLayout from './layouts/PublicLayout';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Feed = lazy(() => import('./pages/Feed'));
const Profile = lazy(() => import('./pages/Profile'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const Explore = lazy(() => import('./pages/Explore'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const SavedPosts = lazy(() => import('./pages/SavedPosts'));
const PostPage = lazy(() => import('./pages/PostPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const Landing = lazy(() => import('./pages/Landing'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const location = useLocation();

  return (
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
            </Route>
          </Route>
          <Route element={<PublicRoute redirectAuthenticated />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<PublicRoute />}>
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/app" element={<Navigate to="/app/feed" replace />} />
              <Route path="/app/feed" element={<Feed />} />
              <Route path="/app/notifications" element={<NotificationsPage />} />
              <Route path="/app/profile/:username" element={<Profile />} />
              <Route path="/app/create-post" element={<CreatePost />} />
              <Route path="/app/explore" element={<Explore />} />
              <Route path="/app/saved" element={<SavedPosts />} />
              <Route path="/app/post/:postId" element={<PostPage />} />
              <Route path="/app/messages" element={<ChatPage />} />
              <Route path="/app/messages/:conversationId" element={<ChatPage />} />
            </Route>
          </Route>
          <Route path="/feed" element={<Navigate to="/app/feed" replace />} />
          <Route path="/about" element={<Navigate to="/#about" replace />} />
          <Route path="/features" element={<Navigate to="/#features" replace />} />
          <Route path="/notifications" element={<Navigate to="/app/notifications" replace />} />
          <Route path="/profile/:username" element={<LegacyProfileRedirect />} />
          <Route path="/create-post" element={<Navigate to="/app/create-post" replace />} />
          <Route path="/explore" element={<Navigate to="/app/explore" replace />} />
          <Route path="/saved" element={<Navigate to="/app/saved" replace />} />
          <Route path="/post/:postId" element={<LegacyPostRedirect />} />
          <Route path="/messages/*" element={<LegacyMessageRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

const LegacyProfileRedirect = () => <Navigate to={`/app${useLocation().pathname}`} replace />;
const LegacyPostRedirect = () => <Navigate to={`/app${useLocation().pathname}`} replace />;
const LegacyMessageRedirect = () => <Navigate to={`/app${useLocation().pathname}`} replace />;

export default App;
