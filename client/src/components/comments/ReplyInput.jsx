import {
  useEffect,
  useRef,
} from 'react';

import Icon from '../icons/Icon';

import { getUsername } from './commentUtils';

const ReplyInput = ({
  value,
  replyingToUser,
  loading,
  onChange,
  onCancel,
  onSubmit,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="mt-3 flex items-center gap-2"
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        disabled={loading}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            onCancel();
          }
        }}
        placeholder={
          replyingToUser
            ? `Reply to @${getUsername(replyingToUser)}`
            : 'Write a reply...'
        }
        className="
          min-w-0 flex-1 rounded-full border border-zinc-200
          bg-white px-4 py-2.5 text-sm text-zinc-900
          shadow-sm outline-none transition-all duration-150
          placeholder:text-zinc-400 focus:border-zinc-400
          focus:bg-white focus:shadow-sm
          disabled:cursor-not-allowed disabled:opacity-60
        "
      />

      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="
          grid h-10 w-10 shrink-0 place-items-center
          rounded-full bg-zinc-950 text-white shadow-sm
          transition-colors duration-150
          hover:bg-zinc-800 active:scale-[0.98]
          disabled:cursor-not-allowed disabled:opacity-40
        "
        aria-label="Post reply"
      >
        <Icon name="send" className="text-[13px]" />
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="
          rounded-full px-3 py-2 text-xs font-semibold
          text-zinc-500 transition-colors duration-150
          hover:bg-zinc-100 hover:text-zinc-900
        "
      >
        Cancel
      </button>
    </form>
  );
};

export default ReplyInput;
