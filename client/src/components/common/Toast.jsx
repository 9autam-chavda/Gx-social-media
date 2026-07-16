import Icon from '../icons/Icon';

const Toast = ({ message, type = 'success' }) => {
  if (!message) return null;

  const iconName = type === 'error' ? 'warning' : 'checkCircle';

  return (
    <div className="fixed right-4 top-4 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink shadow-soft motion-safe:animate-[modalEnter_160ms_ease-out]">
      <Icon
        name={iconName}
        className={type === 'error' ? 'text-red-600' : 'text-brand'}
      />
      <span>{message}</span>
    </div>
  );
};

export default Toast;
