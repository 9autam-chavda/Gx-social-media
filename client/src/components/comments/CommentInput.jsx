import {
  useEffect,
  useRef,
} from 'react';

import Icon from '../icons/Icon';

import Avatar from '../common/Avatar';

const CommentInput = ({
  currentUser,
  value,
  onChange,
  onSubmit,
  loading,
  error,
  variant = 'thought',
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = '0px';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
  }, [value]);

  const dense = variant === 'media';

  return (
    <form
      onSubmit={onSubmit}
      className={`
        sticky bottom-0 z-20 border-t border-zinc-200/80
        bg-white/95 backdrop-blur-xl
        ${dense ? 'p-3 sm:p-4' : 'p-3 sm:p-5'}
      `}
    >
      <div className="flex items-end gap-3">
        <Avatar
          user={currentUser}
          size="sm"
          className="hidden sm:block"
        />

        <div
          className="
            flex min-w-0 flex-1 items-end gap-2 rounded-full
            border border-zinc-200 bg-zinc-50 px-4 py-2
            shadow-sm transition-all duration-150
            focus-within:border-zinc-400 focus-within:bg-white
            focus-within:shadow-sm
          "
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            disabled={loading}
            placeholder="Add a comment..."
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                onSubmit(event);
              }
            }}
            className={`
              max-h-36 min-h-9 flex-1 resize-none bg-transparent
              py-2 text-zinc-900 outline-none
              placeholder:text-zinc-400 disabled:cursor-not-allowed
              ${dense ? 'text-sm leading-5' : 'text-[15px] leading-6'}
            `}
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
            aria-label="Post comment"
          >
            <Icon name="send" className="text-[14px]" />
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-2 px-1 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </form>
  );
};

export default CommentInput;
