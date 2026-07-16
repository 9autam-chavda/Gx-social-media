import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import PostDetail from '../components/post/PostDetail';
import { useAuth } from '../hooks/useAuth';
import { usePost } from '../hooks/usePost';
import { postService } from '../services/postService';
import { getErrorMessage } from '../utils/api';

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { post, loading, error, setPost } = usePost(postId);
  const [commentLoading, setCommentLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (!postId) {
      navigate('/feed', { replace: true });
    }
  }, [postId, navigate]);

  const currentUserId = user?.id || user?._id;

  const handleCommentsUpdated = useCallback(
    async (text) => {
      if (!postId || !post) {
        setActionError('Cannot add comment at this time');
        return null;
      }

      setCommentLoading(true);
      setActionError('');

      try {
        const response = await postService.addComment(postId, text);
        const comment = response?.comment || response;

        setPost((current) => {
          if (!current) return current;

          return {
            ...current,
            comments: [comment, ...(current.comments || [])].filter(Boolean),
            commentCount: (current.commentCount ?? current.comments?.length ?? 0) + 1,
          };
        });

        return comment;
      } catch (err) {
        setActionError(getErrorMessage(err, 'Unable to add comment'));
        return null;
      } finally {
        setCommentLoading(false);
      }
    },
    [postId, post, setPost]
  );

  const handleDeleteComment = useCallback(
    async (comment) => {
      if (!post || !comment?._id) {
        setActionError('Cannot delete comment at this time');
        return;
      }

      setActionError('');

      try {
        await postService.deleteComment(comment._id);

        setPost((current) => {
          if (!current) return current;

          return {
            ...current,
            comments: (current.comments || []).filter((item) => item._id !== comment._id),
            commentCount: Math.max(0, (current.commentCount ?? current.comments?.length ?? 1) - 1),
          };
        });
      } catch (err) {
        setActionError(getErrorMessage(err, 'Unable to delete comment'));
      }
    },
    [post, setPost]
  );

  const handleToggleLike = useCallback(
    async (isLiked) => {
      if (!post) return;

      try {
        const response = await postService.toggleLike(postId, isLiked);

        setPost((current) => {
          if (!current) return current;

          return {
            ...current,
            isLiked: response?.isLiked ?? !isLiked,
            likeCount: response?.likeCount ?? current.likeCount,
            likes: response?.likes ?? current.likes,
          };
        });
      } catch (err) {
        setActionError(getErrorMessage(err, 'Unable to update like status'));
      }
    },
    [postId, post, setPost]
  );

  const handleToggleSave = useCallback(
    async (isSaved) => {
      if (!post) return;

      try {
        const response = isSaved
          ? await postService.unsavePost(postId)
          : await postService.savePost(postId);
        const serverSaved = response?.isSaved ?? response?.saved ?? !isSaved;

        setPost((current) => {
          if (!current) return current;

          return {
            ...current,
            isSaved: Boolean(serverSaved),
            saved: Boolean(serverSaved),
          };
        });
      } catch (err) {
        setActionError(getErrorMessage(err, 'Unable to update save status'));
      }
    },
    [postId, post, setPost]
  );

  if (loading) {
    return (
      <section className="p-2 sm:p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="app-panel overflow-hidden p-4">
            <div className="flex items-center gap-3">
              <div className="skeleton h-11 w-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-36 rounded-full" />
                <div className="skeleton h-3 w-24 rounded-full" />
              </div>
            </div>
            <div className="skeleton mt-4 aspect-[4/5] w-full rounded-2xl" />
            <div className="mt-4 flex justify-between">
              <div className="flex gap-2">
                <div className="skeleton h-10 w-20 rounded-full" />
                <div className="skeleton h-10 w-20 rounded-full" />
              </div>
              <div className="skeleton h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-2 sm:p-4">
        <div className="mx-auto max-w-4xl">
          <EmptyState title="Unable to load post" description={error} />
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="p-2 sm:p-4">
        <div className="mx-auto max-w-4xl">
          <EmptyState
            title="Post not found"
            description="This post may have been deleted or is no longer available."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-2 sm:px-2 sm:py-4">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 rounded-full px-3 py-2 text-sm font-semibold text-brand transition-colors duration-150 hover:bg-brand-soft active:scale-[0.98]"
          type="button"
        >
          &larr; Back
        </button>

        <PostDetail
          post={post}
          loading={false}
          error={null}
          currentUser={user}
          currentUserId={currentUserId}
          onCommentSubmit={handleCommentsUpdated}
          onDeleteComment={handleDeleteComment}
          onToggleLike={handleToggleLike}
          onToggleSave={handleToggleSave}
          onPostChange={setPost}
          commentLoading={commentLoading}
          actionError={actionError}
          hideCloseButton
        />
      </div>
    </section>
  );
};

export default PostPage;
