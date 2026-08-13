import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import {
  getConversationId,
  mergeMessages,
  mergeById,
  sortConversationsByActivity,
} from '../components/chat/chatUtils';
import { useAuth } from '../hooks/useAuth';
import { chatService } from '../services/chatService';
import {
  connectSocket,
  sendSocketMessage,
} from '../socket/socket';
import { getErrorMessage } from '../utils/api';
import { getId } from '../utils/formatters';

const makeClientId = () =>
  `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = getId(user);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const conversationsRef = useRef([]);
  const activeConversationIdRef = useRef('');
  const currentUserIdRef = useRef('');
  const messageRequestRef = useRef(0);

  const activeConversationId =
    getConversationId(activeConversation) || conversationId;

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId || '';
  }, [activeConversationId]);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  const upsertConversation = useCallback((conversation) => {
    if (!conversation?._id) return;

    setConversations((current) => {
      const merged = mergeById(
        current,
        [conversation],
        getConversationId
      );

      return sortConversationsByActivity(merged);
    });
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      setError('');
      const data = await chatService.getConversations();
      setConversations(sortConversationsByActivity(Array.isArray(data) ? data : []));
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load conversations'));
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!conversationId || conversations.length === 0) return;

    const match = conversations.find(
      (conversation) => getConversationId(conversation) === conversationId
    );

    if (match) {
      setActiveConversation(match);
    }
  }, [conversationId, conversations]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConversationId) {
        setMessages([]);
        return;
      }

      const requestId = messageRequestRef.current + 1;
      messageRequestRef.current = requestId;

      try {
        setLoadingMessages(true);
        setError('');
        const data = await chatService.getMessages(activeConversationId);

        if (messageRequestRef.current !== requestId) return;

        setMessages(mergeMessages([], Array.isArray(data?.messages) ? data.messages : []));
        setConversations((current) =>
          current.map((conversation) =>
            getConversationId(conversation) === activeConversationId
              ? { ...conversation, unreadCount: 0 }
              : conversation
          )
        );
      } catch (err) {
        if (messageRequestRef.current !== requestId) return;
        setError(getErrorMessage(err, 'Unable to load messages'));
      } finally {
        if (messageRequestRef.current === requestId) {
          setLoadingMessages(false);
        }
      }
    };

    loadMessages();
  }, [activeConversationId]);

  useEffect(() => {
    const socket = connectSocket();

    if (!socket) return undefined;

    const handlePresence = (payload = {}) => {
      setOnlineUserIds(new Set(payload.onlineUserIds || []));
    };

    const handleMessage = (payload = {}) => {
      const nextMessage = payload.message;
      const nextConversationId =
        payload.conversationId || getId(nextMessage?.conversationId);

      if (!nextMessage || !nextConversationId) return;

      const activeId = activeConversationIdRef.current;
      const viewerId = currentUserIdRef.current;

      if (nextConversationId === activeId) {
        setMessages((current) => {
          const withoutPending = current.filter(
            (message) =>
              !(
                payload.clientId &&
                message.clientId === payload.clientId
              )
          );

          return mergeMessages(withoutPending, [nextMessage]);
        });
      }

      const knownConversation =
        conversationsRef.current.some(
          (conversation) =>
            getConversationId(conversation) === nextConversationId
        );

      setConversations((current) => {
        const updated = current.map((conversation) => {
          if (getConversationId(conversation) !== nextConversationId) {
            return conversation;
          }

          return {
            ...conversation,
            lastMessage: nextMessage,
            updatedAt: nextMessage.createdAt || new Date().toISOString(),
            unreadCount:
              nextConversationId === activeId ||
              getId(nextMessage.sender) === viewerId
                ? 0
                : (conversation.unreadCount || 0) + 1,
          };
        });

        return sortConversationsByActivity(updated);
      });

      if (!knownConversation) {
        loadConversations();
      }
    };

    const handleReconnect = () => {
      socket.emit('presence:get', handlePresence);
      loadConversations();

      const activeId = activeConversationIdRef.current;

      if (activeId) {
        chatService
          .getMessages(activeId)
          .then((data) => {
            setMessages((current) =>
              mergeMessages(
                current,
                Array.isArray(data?.messages) ? data.messages : []
              )
            );
          })
          .catch(() => {});
      }
    };

    socket.on('presence:update', handlePresence);
    socket.on('message:new', handleMessage);
    socket.on('connect', handleReconnect);
    socket.io.on('reconnect', handleReconnect);

    socket.emit('presence:get', handlePresence);

    return () => {
      socket.off('presence:update', handlePresence);
      socket.off('message:new', handleMessage);
      socket.off('connect', handleReconnect);
      socket.io.off('reconnect', handleReconnect);
    };
  }, [loadConversations]);

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    navigate(`/app/messages/${getConversationId(conversation)}`);
  };

  const handleBack = () => {
    setActiveConversation(null);
    navigate('/app/messages');
  };

  const handleStartConversation = async (participant) => {
    try {
      setError('');
      const conversation = await chatService.createConversation(getId(participant));
      upsertConversation(conversation);
      handleSelectConversation(conversation);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to start conversation'));
    }
  };

  const handleSend = async (text) => {
    if (!activeConversationId || sending) return;

    const clientId = makeClientId();
    const optimisticMessage = {
      _id: clientId,
      clientId,
      conversationId: activeConversationId,
      sender: user,
      text,
      pending: true,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, optimisticMessage]);
    setSending(true);
    setConversations((current) =>
      sortConversationsByActivity(
        current.map((conversation) =>
          getConversationId(conversation) === activeConversationId
            ? {
                ...conversation,
                lastMessage: optimisticMessage,
                updatedAt: optimisticMessage.createdAt,
              }
            : conversation
        )
      )
    );

    const targetConversationId = activeConversationId;

    sendSocketMessage(
      {
        clientId,
        conversationId: targetConversationId,
        text,
      },
      async (ack) => {
        if (ack?.ok) {
          if (ack.message) {
            setMessages((current) =>
              mergeMessages(
                current.filter((item) => item.clientId !== clientId),
                [ack.message]
              )
            );
          }

          setSending(false);
          return;
        }

        try {
          const message = await chatService.sendMessage({
            conversationId: targetConversationId,
            text,
            clientId,
          });

          setMessages((current) =>
            mergeMessages(
              current.filter((item) => item.clientId !== clientId),
              [message]
            )
          );
          setConversations((current) =>
            sortConversationsByActivity(
              current.map((conversation) =>
                getConversationId(conversation) === targetConversationId
                  ? {
                      ...conversation,
                      lastMessage: message,
                      updatedAt: message.createdAt,
                    }
                  : conversation
              )
            )
          );
        } catch (err) {
          setError(getErrorMessage(err, 'Unable to send message'));
          setMessages((current) =>
            current.filter((message) => message.clientId !== clientId)
          );
        } finally {
          setSending(false);
        }
      }
    );
  };

  const shellClass = useMemo(
    () =>
      `app-panel mx-auto flex h-[calc(100dvh-8.5rem)] min-h-[520px] max-w-6xl overflow-hidden md:h-[calc(100dvh-7rem)] lg:h-[calc(100dvh-2rem)]`,
    []
  );

  return (
    <section className="pb-2">
      {error && (
        <div className="app-alert mx-auto mb-3 max-w-6xl">
          {error}
        </div>
      )}

      <div className={shellClass}>
        <div
          className={`h-full w-full md:block md:w-96 ${
            activeConversation ? 'hidden' : 'block'
          }`}
        >
          <ChatSidebar
            activeConversationId={activeConversationId}
            conversations={conversations}
            currentUserId={currentUserId}
            loading={loadingConversations}
            onlineUserIds={onlineUserIds}
            onSelectConversation={handleSelectConversation}
            onStartConversation={handleStartConversation}
          />
        </div>

        <div
          className={`h-full min-w-0 flex-1 ${
            activeConversation ? 'flex' : 'hidden md:flex'
          }`}
        >
          <ChatWindow
            conversation={activeConversation}
            currentUserId={currentUserId}
            loading={loadingMessages}
            messages={messages}
            onlineUserIds={onlineUserIds}
            onBack={handleBack}
            onSend={handleSend}
            sending={sending}
          />
        </div>
      </div>
    </section>
  );
};

export default ChatPage;
