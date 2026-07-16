import { getId, timeAgo } from '../../utils/formatters';

const MessageBubble = ({ message, currentUserId }) => {
  const own =
    getId(message?.sender) === currentUserId?.toString();

  return (
    <div className={`flex animate-[modalEnter_160ms_ease_both] ${own ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-5 shadow-sm transition duration-150 ${
          own
            ? 'rounded-br-md bg-ink text-white'
            : 'rounded-bl-md border border-line bg-white text-ink'
        } ${message.pending ? 'opacity-70' : ''}`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <p
          className={`mt-1 text-[10px] font-semibold ${
            own ? 'text-white/60' : 'text-ink-muted'
          }`}
        >
          {message.pending ? 'Sending...' : timeAgo(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
