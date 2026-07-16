import Icon from '../icons/Icon';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';

const PostActions = ({
  post,
  currentUser,
  onCommentClick,
  onPostChange,
  onError,
}) => {
  const commentCount = post?.commentCount || post?.comments?.length || 0;

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      <div className="flex min-w-0 items-center gap-1 sm:gap-3">
        <LikeButton
          post={post}
          currentUser={currentUser}
          onOptimisticChange={
            onPostChange
          }
          onError={onError}
        />

        <button
          aria-label="Open comments"
          className="group flex h-8 items-center gap-1.5 rounded-full px-2 text-ink-muted transition-all duration-200 hover:bg-surface-muted hover:text-ink active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:h-10 sm:gap-2 sm:px-3"
          onClick={onCommentClick}
          title="Comment"
          type="button"
        >
          <Icon name="comment" className="text-[0.95rem] transition-colors duration-150 sm:text-[1.05rem]" />
          <span className="text-xs font-black sm:text-sm">{commentCount}</span>
        </button>

        <button
          aria-label="Share post"
          className="group hidden h-8 items-center gap-1.5 rounded-full px-2 text-ink-muted transition-all duration-200 hover:bg-surface-muted hover:text-ink active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white xs:flex sm:h-10 sm:gap-2 sm:px-3"
          title="Share"
          type="button"
        >
          <Icon name="share" className="text-[0.95rem] transition-colors duration-150 sm:text-[1.05rem]" />
        </button>
      </div>

      <SaveButton
        post={post}
        currentUser={currentUser}
        onOptimisticChange={
          onPostChange
        }
        onError={onError}
      />
    </div>
  );
};

export default PostActions;
