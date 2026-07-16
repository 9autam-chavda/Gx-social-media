import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { postService } from '../../services/postService';
import { usePost } from '../../hooks/usePost';
import PostDetail from './PostDetail';
import EmptyState from '../common/EmptyState';
import { getErrorMessage } from '../../utils/api';

const PostModal = ({ postId, open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { post, loading, error, setPost } = usePost(postId);
  const [commentLoading, setCommentLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const currentUserId = user?.id || user?._id;

  useEffect(() => {
    if (!open || !postId) return;

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        if (onClose) return onClose();
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [navigate, onClose, open, postId]);

  const handleClose = () => {
    if (onClose) return onClose();
    navigate(-1);
  };

  const handleCommentsUpdated = async (text) => {
    if (!postId) return;
    setCommentLoading(true);
    setActionError('');

    try {
      const data = await postService.addComment(postId, text);
      setPost((current) => ({
        ...current,
        comments: [...(current?.comments || []), data.comment],
        commentCount: (current?.commentCount ?? current?.comments?.length ?? 0) + 1,
      }));
    } catch (err) {
      setActionError(getErrorMessage(err, 'Unable to add comment'));
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment =
  async (comment) => {
    try {
      await postService.deleteComment(
        comment._id
      );

      setPost((prev) => ({
        ...prev,

        comments:
          prev.comments.filter(
            (c) =>
              c._id !==
              comment._id
          ),
        commentCount: Math.max(0, (prev.commentCount ?? prev.comments?.length ?? 1) - 1),
      }));
    } catch (err) {
      setActionError(getErrorMessage(err, 'Unable to delete comment'));
    }
  };

  const updatePost = (updater) => setPost((current) => (typeof updater === 'function' ? updater(current) : updater));

  if (!open) return null;

  if (!postId) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-slate-950/80 p-4 backdrop-blur-sm">
        <EmptyState title="Invalid post" description="Post ID is missing." />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-slate-950/80 p-4 backdrop-blur-sm">
      <PostDetail
        post={post}
        loading={loading}
        error={error}
        currentUser={user}
        currentUserId={currentUserId}
        onCommentSubmit={handleCommentsUpdated}
        onDeleteComment={handleDeleteComment}
        onPostChange={updatePost}
        onClose={handleClose}
        onCommentClick={() => {}}
        onError={setActionError}
        commentLoading={commentLoading}
        actionError={actionError}
      />
    </div>
  );
};

export default PostModal;
