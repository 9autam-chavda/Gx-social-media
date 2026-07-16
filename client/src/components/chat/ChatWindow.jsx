import { useEffect, useRef } from 'react';
import Icon from '../icons/Icon';
import EmptyState from '../common/EmptyState';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { getMessageId } from './chatUtils';

const ChatWindow = ({
  conversation,
  currentUserId,
  messages,
  loading,
  sending,
  onlineUserIds,
  onBack,
  onSend,
}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages.length, conversation?._id]);

  if (!conversation) {
    return (
      <section className="hidden min-h-0 flex-1 place-items-center bg-surface-muted md:grid">
        <EmptyState
          icon={() => <Icon name="message" />}
          title="Select a conversation"
          description="Choose a message thread or search for someone to start a private chat."
        />
      </section>
    );
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-surface-muted">
      <ChatHeader
        conversation={conversation}
        currentUserId={currentUserId}
        onlineUserIds={onlineUserIds}
        onBack={onBack}
      />

      <div
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5"
        ref={scrollRef}
        aria-live="polite"
      >
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((item) => (
              <div
                className={`skeleton h-10 max-w-[70%] rounded-2xl ${
                  item % 2 ? 'ml-auto' : ''
                }`}
                key={item}
              />
            ))}
          </div>
        ) : messages.length ? (
          <div className="space-y-2.5">
            {messages.map((message) => (
              <MessageBubble
                currentUserId={currentUserId}
                key={getMessageId(message)}
                message={message}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={() => <Icon name="message" />}
            title="No messages yet"
            description="Send a message to start the conversation."
          />
        )}
      </div>

      <MessageInput disabled={sending} onSend={onSend} />
    </section>
  );
};

export default ChatWindow;
