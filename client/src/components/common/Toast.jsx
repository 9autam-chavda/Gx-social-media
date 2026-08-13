import Icon from '../icons/Icon';

const Toast = ({ message, type = 'success' }) => {
  if (!message) return null;

  const iconName = type === 'error' ? 'warning' : 'checkCircle';
  const tone = type === 'error' ? 'border-danger/20 bg-red-50 text-danger' : 'border-brand/15 bg-white text-brand';

  return (
    <div className={`fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 rounded-card border px-4 py-3 text-sm font-semibold text-ink shadow-soft motion-safe:animate-[modalEnter_160ms_ease-out] ${tone}`} role="status" aria-live="polite">
      <Icon
        name={iconName}
        className={type === 'error' ? 'text-danger' : 'text-brand'}
      />
      <span>{message}</span>
    </div>
  );
};

export default Toast;
