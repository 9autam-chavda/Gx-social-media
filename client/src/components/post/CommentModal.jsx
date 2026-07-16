import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Icon from '../icons/Icon';

import CommentSection from './CommentSection';

import commentService from '../../services/commentService';
import { getErrorMessage } from '../../utils/api';

const LIMIT = 10;

const CommentModal = ({
  open,
  post,
  currentUserId,
  onClose,
  onCommentAdded,
}) => {
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const postId = post?._id;

  const loadComments = useCallback(
    async (nextPage = 1, append = false) => {
      if (!postId) return;

      try {
        setError('');
        append ? setLoadingMore(true) : setLoadingComments(true);

        const data = await commentService.getComments(postId, nextPage, LIMIT);
        const incoming = Array.isArray(data) ? data : [];

        setComments((prev) => {
          if (!append) return incoming;

          const seen = new Set(prev.map((comment) => comment._id));
          return [
            ...prev,
            ...incoming.filter((comment) => !seen.has(comment._id)),
          ];
        });

        setHasMore(incoming.length === LIMIT);
        setPage(nextPage);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load comments'));
      } finally {
        setLoadingComments(false);
        setLoadingMore(false);
      }
    },
    [postId]
  );

  useEffect(() => {
    if (open) {
      setText('');
      loadComments(1, false);
    }
  }, [loadComments, open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    await loadComments(page + 1, true);
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === updatedComment?._id
          ? {
              ...comment,
              ...updatedComment,
            }
          : comment
      )
    );
  };

  const handleCommentDeleted = (commentId) => {
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const value = text.trim();
    if (!value || submitting) return;

    try {
      setSubmitting(true);
      setError('');

      const comment = await commentService.createComment(postId, value);

      setComments((prev) => [
        comment,
        ...prev.filter((item) => item._id !== comment._id),
      ]);

      onCommentAdded?.(comment);
      setText('');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to add comment'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
      className="
        fixed inset-0 z-50 grid place-items-end bg-black/50 p-0
        backdrop-blur-sm sm:place-items-center sm:p-4
      "
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="comments-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="
          flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden
          rounded-t-3xl bg-white shadow-2xl animate-[modalEnter_180ms_ease-out]
          sm:rounded-3xl
        "
      >
        <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <h2 id="comments-title" className="text-lg font-bold text-zinc-900">
            Comments
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close comments"
            className="
              grid h-10 w-10 place-items-center rounded-full text-zinc-500
              transition-colors duration-150 hover:bg-zinc-100 hover:text-black
              active:scale-[0.98]
            "
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {loadingComments ? (
            <div className="space-y-3 p-4">
              {[0, 1, 2].map((item) => (
                <div key={item} className="skeleton h-16 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="p-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          ) : (
            <>
              <CommentSection
                comments={comments}
                currentUserId={currentUserId}
                onCommentDeleted={handleCommentDeleted}
                onCommentUpdated={handleCommentUpdated}
              />

              {hasMore && (
                <div className="pb-4 text-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="
                      rounded-full border border-zinc-200 px-4 py-2 text-xs
                      font-semibold text-zinc-600 transition-colors duration-150
                      hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-50
                    "
                  >
                    {loadingMore ? 'Loading...' : 'Load more comments'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 border-t border-zinc-200 bg-white p-4">
          <input
            type="text"
            maxLength={500}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Add a comment..."
            className="
              min-w-0 flex-1 rounded-full border border-zinc-200 bg-zinc-50
              px-5 py-3 text-sm outline-none transition-all
              placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white
            "
          />

          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="
              rounded-full bg-black px-5 py-3 text-sm font-semibold text-white
              transition-colors duration-150 hover:bg-zinc-800 active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default CommentModal;
