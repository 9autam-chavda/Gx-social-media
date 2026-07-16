import Icon from '../icons/Icon';
import { getImageUrl } from '../../utils/formatters';

const Avatar = ({ user, size = 'md', className = '' }) => {
  const sizes = {
    xs: 'h-6 w-6',

    sm: 'h-9 w-9',

    md: 'h-11 w-11',

    lg: 'h-20 w-20',

    xl: 'h-28 w-28',
  };
  const image = getImageUrl(user?.profilePicture);

  return (
    <div
      className={`${sizes[size]} shrink-0 overflow-hidden rounded-full border border-line bg-slate-100 text-slate-400 ${className}`}
    >
      {image ? (
        <img
          className="h-full w-full object-cover"
          src={image}
          alt={user?.username || 'User'}
          decoding="async"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="grid h-full w-full place-items-center">
          <Icon name="user" className="text-[45%]" />
        </div>
      )}
    </div>
  );
};

export default Avatar;
