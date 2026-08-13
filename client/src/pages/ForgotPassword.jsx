import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthShell from '../components/auth/AuthShell';
import Icon from '../components/icons/Icon';
import { authService } from '../services/authService';
import { getErrorMessage } from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!email.trim()) return setError('Please enter your email address.');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Please enter a valid email address.');
    if (!newPassword) return setError('Please enter a new password.');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters.');
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    setSubmitting(true);
    try {
      await authService.forgotPassword({ email, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to send reset instructions. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return <AuthShell title={success ? 'Password updated' : 'Reset your password'} subtitle={success ? 'Your password has been updated. You can now log in.' : 'Enter your email and choose a new password.'} footerText="Remembered your password?" footerLink="/login" footerLabel="Log in">
    {success ? <Link className="primary-button w-full" to="/login">Log in <Icon name="arrowRight" size={16} /></Link> : <form className="grid gap-4" onSubmit={handleSubmit}>
      {error && <p className="app-alert" role="alert">{error}</p>}
      <label className="grid gap-2 text-sm font-bold text-ink">Email address
        <input className="form-field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required />
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">New password
        <span className="relative"><input className="form-field pr-12" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength="6" required /><button type="button" className="absolute inset-y-0 right-2 icon-button h-10 w-10" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}><Icon name={showPassword ? 'eyeOff' : 'eye'} /></button></span>
      </label>
      <label className="grid gap-2 text-sm font-bold text-ink">Confirm new password
        <span className="relative"><input className="form-field pr-12" type={showConfirmation ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength="6" required /><button type="button" className="absolute inset-y-0 right-2 icon-button h-10 w-10" onClick={() => setShowConfirmation(!showConfirmation)} aria-label={showConfirmation ? 'Hide password confirmation' : 'Show password confirmation'}><Icon name={showConfirmation ? 'eyeOff' : 'eye'} /></button></span>
      </label>
      <button className="primary-button mt-2 w-full" type="submit" disabled={submitting}>{submitting ? 'Resetting…' : 'Reset password'} <Icon name="arrowRight" size={16} /></button>
    </form>}
  </AuthShell>;
};
export default ForgotPassword;
