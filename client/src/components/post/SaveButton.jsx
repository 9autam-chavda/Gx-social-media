import { useState } from 'react';
import Icon from '../icons/Icon';
import { postService } from '../../services/postService';
import { getErrorMessage } from '../../utils/api';
import { getId } from '../../utils/formatters';

const SaveButton = ({ post, onOptimisticChange, onError }) => {
  const postId = getId(post);
  const derivedSaved = Boolean(post?.isSaved ?? post?.saved);
  const [optimistic, setOptimistic] = useState(null);
  const [loading, setLoading] = useState(false);
  const saved = optimistic?.postId === postId ? optimistic.saved : derivedSaved;

  const handleToggle = async () => {
    if (!postId || loading) return;

    const previous = saved;
    const nextSaved = !saved;

    setOptimistic({ postId, saved: nextSaved });
    setLoading(true);
    onError?.('');
    onOptimisticChange?.((current) => ({ ...current, isSaved: nextSaved, saved: nextSaved }));

    try {
      const data = nextSaved ? await postService.savePost(postId) : await postService.unsavePost(postId);
      const serverSaved = data.isSaved ?? data.saved ?? nextSaved;
      setOptimistic(null);
      onOptimisticChange?.((current) => ({ ...current, isSaved: Boolean(serverSaved), saved: Boolean(serverSaved) }));
    } catch (error) {
      setOptimistic(null);
      onOptimisticChange?.((current) => ({ ...current, isSaved: previous, saved: previous }));
      onError?.(getErrorMessage(error, 'Unable to update saved post'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`grid h-8 w-8 place-items-center rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] disabled:opacity-70 sm:h-10 sm:w-10 ${
        saved
          ? 'bg-brand-soft text-brand'
          : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
      }`}
      onClick={handleToggle}
      type="button"
      aria-label={saved ? 'Unsave post' : 'Save post'}
      aria-pressed={saved}
      disabled={loading}
      title={saved ? 'Unsave' : 'Save'}
    >
      <Icon
        name={saved ? 'bookmark' : 'bookmarkOutline'}
        className={saved ? 'animate-[iconPop_160ms_ease-out]' : ''}
        size={20}
      />
    </button>
  );
};

export default SaveButton;
