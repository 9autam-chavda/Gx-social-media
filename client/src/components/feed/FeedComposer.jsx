import { Link } from 'react-router-dom';
import Icon from '../icons/Icon';
import Avatar from '../common/Avatar';

const FeedComposer = ({ user }) => (
  <article className="feed-card p-3 sm:p-4">
    <Link className="group flex items-center gap-2.5 sm:gap-3" to="/app/create-post">
      <Avatar user={user} size="sm" className="sm:h-10 sm:w-10" />
      <div className="min-w-0 flex-1 rounded-full border border-line bg-surface-muted px-3.5 py-2.5 text-sm font-medium text-ink-muted transition-colors duration-150 group-hover:border-brand/30 group-hover:bg-white group-hover:text-ink">
        Share a thought, photo, or moment...
      </div>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-sm text-white transition-colors duration-150 group-hover:bg-brand sm:h-10 sm:w-10">
        <Icon name="plus" />
      </span>
    </Link>
  </article>
);

export default FeedComposer;
