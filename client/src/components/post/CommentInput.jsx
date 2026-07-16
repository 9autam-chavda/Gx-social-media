import { useState } from 'react';

const CommentInput = ({ onSubmit, loading }) => {
  const [text, setText] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    await onSubmit(trimmed);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Add a comment..."
        className="form-field flex-1 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink focus:border-brand focus:outline-none"
      />
      <button className="primary-button rounded-full px-4" type="submit" disabled={loading || !text.trim()}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

export default CommentInput;
