import PostImage from '../post/PostImage';
import FeedCaption from './FeedCaption';
import FeedPostMeta from './FeedPostMeta';
import PostActions from '../post/PostActions';

const FeedMediaCard = ({
  post,
  authorPath,
  currentUser,
  onCommentClick,
  onPostChange,
  onError,
}) => (
  <article className="feed-card group overflow-hidden">
    <div className="px-3 py-2.5 sm:p-5 sm:pb-4">
      <FeedPostMeta post={post} authorPath={authorPath} />
    </div>

    <div className="overflow-hidden bg-black/95">
      <PostImage post={post} />
    </div>

    <div className="space-y-1.5 px-3 py-2.5 sm:space-y-3 sm:p-5 sm:pt-4">
      <PostActions
        post={post}
        currentUser={currentUser}
        onCommentClick={onCommentClick}
        onPostChange={onPostChange}
        onError={onError}
      />
      <FeedCaption post={post} authorPath={authorPath} />
    </div>
  </article>
);

export default FeedMediaCard;
