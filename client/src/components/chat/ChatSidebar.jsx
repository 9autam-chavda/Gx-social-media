import { useEffect, useMemo, useState } from 'react';
import Icon from '../icons/Icon';
import Avatar from '../common/Avatar';
import EmptyState from '../common/EmptyState';
import { searchService } from '../../services/searchService';
import { getId } from '../../utils/formatters';
import {
  getConversationId,
  getConversationTime,
  getConversationTitle,
  getLastMessagePreview,
  getOtherParticipant,
} from './chatUtils';

const ChatSidebar = ({
  conversations,
  activeConversationId,
  currentUserId,
  loading,
  onlineUserIds,
  onSelectConversation,
  onStartConversation,
}) => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const searchTerm = query.trim();

    if (!searchTerm) {
      setResults([]);
      setSearching(false);
      return undefined;
    }

    const timeout = setTimeout(async () => {
      try {
        setSearching(true);
        const data = await searchService.search(searchTerm);
        setResults(
          (data?.users || []).filter(
            (user) => getId(user) !== currentUserId
          )
        );
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [currentUserId, query]);

  const visibleConversations = useMemo(
    () => conversations || [],
    [conversations]
  );

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-line bg-white">
      <header className="border-b border-line px-4 py-3">
        <h1 className="text-xl font-black tracking-tight text-ink">Messages</h1>
        <label className="mt-3 flex items-center gap-2 rounded-full border border-line bg-surface-muted px-3 py-2 text-sm text-ink-muted transition-all duration-150 focus-within:border-brand/40 focus-within:bg-white focus-within:shadow-sm">
          <Icon name="search" className="text-xs" />
          <input
            className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-muted"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people"
            type="search"
            aria-label="Search people"
          />
        </label>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {query.trim() ? (
          <div className="space-y-1" aria-live="polite">
            {searching && (
              <p className="px-3 py-2 text-sm font-semibold text-ink-muted" role="status">
                Searching...
              </p>
            )}

            {!searching &&
              results.map((user) => (
                <button
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-150 hover:bg-surface-muted active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  key={getId(user)}
                  onClick={() => onStartConversation(user)}
                  type="button"
                >
                  <Avatar user={user} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-ink">
                      @{user.username}
                    </p>
                    <p className="truncate text-xs font-semibold text-ink-muted">
                      Start a conversation
                    </p>
                  </div>
                </button>
              ))}

            {!searching && results.length === 0 && (
              <p className="px-3 py-8 text-center text-sm font-semibold text-ink-muted">
                No people found
              </p>
            )}
          </div>
        ) : loading ? (
          <div className="space-y-2 p-2">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="skeleton h-16 rounded-2xl" />
            ))}
          </div>
        ) : visibleConversations.length ? (
          <div className="space-y-1">
            {visibleConversations.map((conversation) => {
              const conversationId = getConversationId(conversation);
              const participant = getOtherParticipant(
                conversation,
                currentUserId
              );
              const isOnline = onlineUserIds.has(getId(participant));
              const isActive = conversationId === activeConversationId;

              return (
                <button
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-150 active:scale-[0.99] ${
                    isActive
                      ? 'bg-brand-soft text-brand shadow-sm'
                      : 'hover:bg-surface-muted hover:shadow-sm'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
                  key={conversationId}
                  onClick={() => onSelectConversation(conversation)}
                  type="button"
                >
                  <div className="relative">
                    <Avatar user={participant} size="md" />
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                        isOnline ? 'bg-emerald-500' : 'bg-zinc-300'
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-black text-ink">
                        {getConversationTitle(conversation, currentUserId)}
                      </p>
                      <span className="shrink-0 text-[11px] font-semibold text-ink-muted">
                        {getConversationTime(conversation)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs font-semibold text-ink-muted">
                      {getLastMessagePreview(conversation)}
                    </p>
                  </div>

                  {conversation.unreadCount > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[11px] font-black text-white">
                      {conversation.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={() => <Icon name="message" />}
            title="No messages yet"
            description="Search for someone to start a private conversation."
          />
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
