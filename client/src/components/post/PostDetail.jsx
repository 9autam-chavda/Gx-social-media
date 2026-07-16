import Loader from '../common/Loader';

import EmptyState from '../common/EmptyState';

import MediaPostDetail from './MediaPostDetail';

import ThoughtPostDetail from './ThoughtPostDetail';

import { getMediaUrl } from '../../utils/formatters';

const PostDetail = (props) => {
  const {
    post,
    loading,
    error,
  } = props;

  if (loading) {
    return (
      <div
        className="
          flex min-h-screen
          items-center justify-center
        "
      >
        <Loader label="Loading post..." />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load post"
        description={error}
      />
    );
  }

  if (!post) {
    return (
      <EmptyState title="Post not found" />
    );
  }

  const mediaUrl =
    getMediaUrl(post);

  if (mediaUrl) {
    return (
      <MediaPostDetail
        {...props}
      />
    );
  }

  return (
    <ThoughtPostDetail
      {...props}
    />
  );
};

export default PostDetail;