import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import AuthShell from '../components/auth/AuthShell';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
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
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Create a profile and start sharing with your community."
      footerText="Already have an account?"
      footerLink="/login"
      footerLabel="Login"
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {error && (
          <p className="app-alert">
            {error}
          </p>
        )}

        <label className="grid gap-2 text-sm font-bold text-ink">
          Username
            <input
              className="form-field"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              minLength="3"
              maxLength="20"
              required
            />
        </label>

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

        <button className="primary-button mt-2 w-full" type="submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
          <Icon name="arrowRight" className="ml-2" />
        </button>
      </form>
    </AuthShell>
  );
};

export default Register;
