import { getId, timeAgo } from '../../utils/formatters';

export const getConversationId = (conversation) =>
  getId(conversation);

export const getMessageId = (message) =>
  message?.clientId || getId(message);

export const getServerMessageId = (message) =>
  getId(message);

export const getOtherParticipant = (conversation, currentUserId) =>
  (conversation?.participants || []).find(
    (participant) =>
      getId(participant) !== currentUserId?.toString()
  );

export const getConversationTitle = (conversation, currentUserId) => {
  const participant =
    getOtherParticipant(conversation, currentUserId);

  return participant?.username
    ? `@${participant.username}`
    : 'Conversation';
};

export const getLastMessagePreview = (conversation) => {
  const text = conversation?.lastMessage?.text;

  if (!text) return 'No messages yet';

  return text.length > 72
    ? `${text.slice(0, 72)}...`
    : text;
};

export const getConversationTime = (conversation) =>
  timeAgo(
    conversation?.lastMessage?.createdAt ||
      conversation?.updatedAt
  );

export const mergeById = (items, incoming, idGetter = getId) => {
  const map = new Map();

  [...items, ...incoming].forEach((item) => {
    const id = idGetter(item);

    if (id) {
      map.set(id, item);
    }
  });

  return Array.from(map.values());
};

export const mergeMessages = (items, incoming) => {
  const byServerId = new Map();
  const result = [];

  [...items, ...incoming].forEach((message) => {
    const serverId = getServerMessageId(message);

    if (serverId && byServerId.has(serverId)) {
      const index = byServerId.get(serverId);
      result[index] = {
        ...result[index],
        ...message,
        pending: false,
      };
      return;
    }

    byServerId.set(serverId || getMessageId(message), result.length);
    result.push(message);
  });

  return result.sort(
    (a, b) =>
      new Date(a.createdAt || 0) -
      new Date(b.createdAt || 0)
  );
};

export const sortConversationsByActivity = (conversations) =>
  [...conversations].sort(
    (a, b) =>
      new Date(b.updatedAt || b.lastMessage?.createdAt || 0) -
      new Date(a.updatedAt || a.lastMessage?.createdAt || 0)
  );
