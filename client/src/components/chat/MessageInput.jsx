import { useState } from 'react';
import Icon from '../icons/Icon';

const MessageInput = ({ disabled, onSend }) => {
  const [text, setText] = useState('');

  const submit = (event) => {
    event.preventDefault();

    const value = text.trim();

    if (!value || disabled) return;

    onSend(value);
    setText('');
  };

  return (
    <form
      className="flex shrink-0 items-end gap-2 border-t border-line bg-white p-3"
      onSubmit={submit}
    >
      <textarea
        className="form-field max-h-28 min-h-10 flex-1 resize-none bg-surface-muted px-4 py-2.5 text-sm leading-5 focus:bg-white"
        disabled={disabled}
        maxLength={2000}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            submit(event);
          }
        }}
        placeholder="Message..."
        rows={1}
        value={text}
      />

      <button
        className="primary-button h-10 min-h-10 w-10 shrink-0 p-0 disabled:opacity-50"
        disabled={disabled || !text.trim()}
        type="submit"
        aria-label="Send message"
      >
        <Icon name="send" className="text-sm" />
      </button>
    </form>
  );
};

export default MessageInput;
