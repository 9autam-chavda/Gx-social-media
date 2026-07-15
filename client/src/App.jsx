import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Loader from './components/common/Loader';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

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

function App() {
  const location = useLocation();

  return (
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/saved" element={<SavedPosts />} />
              <Route path="/post/:postId" element={<PostPage />} />
              <Route path="/messages" element={<ChatPage />} />
              <Route path="/messages/:conversationId" element={<ChatPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
