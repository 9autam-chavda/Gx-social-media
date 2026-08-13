import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import AuthShell from '../components/auth/AuthShell';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(formData);
      navigate(location.state?.from?.pathname || '/app', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to pick up your feed where you left it."
      footerText="New here?"
      footerLink="/register"
      footerLabel="Create an account"
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {error && (
          <p className="app-alert">
            {error}
          </p>
        )}

        <label className="grid gap-2 text-sm font-bold text-ink">
          Email
            <input
              className="form-field"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="****@****.com"
              required
            />
        </label>

        <label className="grid gap-2 text-sm font-bold text-ink">
          Password
            <input
              className="form-field"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="password"
              minLength="6"
              required
            />
        </label>
        <Link className="-mt-1 text-right text-sm font-bold text-brand hover:text-blue-800" to="/forgot-password">Forgot password?</Link>

        <button className="primary-button mt-2 w-full" type="submit" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
          <Icon name="arrowRight" className="ml-2" />
        </button>
      </form>
    </AuthShell>
  );
};

export default Login;
