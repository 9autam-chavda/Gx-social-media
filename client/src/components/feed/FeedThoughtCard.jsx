import FeedCaption from './FeedCaption';
import FeedPostMeta from './FeedPostMeta';
import PostActions from '../post/PostActions';

const FeedThoughtCard = ({
  post,
  authorPath,
  currentUser,
  onCommentClick,
  onPostChange,
  onError,
}) => (
  <article className="feed-card p-3 sm:p-5">
    <FeedPostMeta post={post} authorPath={authorPath} />

    <div className="mt-3 rounded-2xl bg-surface-muted/80 px-3 py-3 sm:mt-5 sm:rounded-3xl sm:px-5 sm:py-5">
      <FeedCaption post={post} authorPath={authorPath} prominent />
    </div>

    <div className="mt-2.5 sm:mt-4">
      <PostActions
        post={post}
        currentUser={currentUser}
        onCommentClick={onCommentClick}
        onPostChange={onPostChange}
        onError={onError}
      />
    </div>
  </article>
);

export default FeedThoughtCard;
