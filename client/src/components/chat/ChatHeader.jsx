import Icon from '../icons/Icon';
import Avatar from '../common/Avatar';
import { getId } from '../../utils/formatters';
import { getConversationTitle, getOtherParticipant } from './chatUtils';

const ChatHeader = ({
  conversation,
  currentUserId,
  onlineUserIds,
  onBack,
}) => {
  const participant =
    getOtherParticipant(conversation, currentUserId);
  const isOnline =
    onlineUserIds.has(getId(participant));

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line bg-white px-3 sm:px-4">
      <button
        className="icon-button h-9 w-9 md:hidden"
        onClick={onBack}
        type="button"
        aria-label="Back to messages"
      >
        <Icon name="arrowLeft" />
      </button>

      <Avatar user={participant} size="sm" />

      <div className="min-w-0">
        <p className="truncate text-sm font-black text-ink">
          {getConversationTitle(conversation, currentUserId)}
        </p>
        <p className="text-xs font-semibold text-ink-muted">
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
    </header>
  );
};

export default ChatHeader;
