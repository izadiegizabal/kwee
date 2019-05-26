import * as MessageActions from './message.actions';

export interface Chat {
  id: number;
  name: string;
  lastMessage: Message;
  img: string;
  totalUnread: number;
}

export interface Message {
  _id: string;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  message: string;
  read?: boolean;
  date: string;
  hour: string;
  __v: number;
}

export interface State {
  messages: {
    chats: {
      data: Chat[],
      total: number
    },
    conver: {
      data: Message[],
      total: number,
    },
    unread: number
  };
  notifications: {
    data: {
      id: number,
      createdAt: Date,
      read: boolean,
      from: any,
      type: string,
      data: any
    }[],
    unread: number,
    total: number,
  };
}

const initialState: State = {
  messages: {
    chats: null,
    conver: null,
    unread: 0
  },
  notifications: {
    data: null,
    unread: 0,
    total: 0,
  },
};

export function messageReducer(state = initialState, action: MessageActions.MessageActions) {
  switch (action.type) {

    // MESSAGES ACTIONS
    case MessageActions.ADD_MESSAGE:
      const receiverChat = state.messages.chats ? getActiveChatByMessage(action.payload, state.messages.chats.data) : undefined;
      if (receiverChat) {
        receiverChat.totalUnread++;
      }
      const unreadCount = state.messages.unread + 1;
      const newConver = state.messages.conver && state.messages.conver.data ? state.messages.conver.data.push(action.payload) : undefined;
      return {
        ...state,
        messages: {
          ...state.messages,
          chats: {
            ...state.messages.chats,
            receiverChat
          },
          unread: unreadCount,
          conver: {
            ...state.messages.conver,
            newConver
          },
        }
      };
    case MessageActions.TRY_POST_MESSAGE:
      const newData = state.messages.conver && state.messages.conver.data ? state.messages.conver.data.push(action.payload) : undefined;
      return {
        ...state,
        messages: {
          ...state.messages,
          conver: {
            ...state.messages.conver,
            newData
          },
        }
      };
    case MessageActions.POST_MESSAGE:
      const reorderedChats = reorderChats(action.payload, state.messages.chats.data);
      let chatsData = state.messages.chats.data;

      if (reorderedChats) {
        const activeChat = getActiveChatByMessage(action.payload, state.messages.chats.data);
        activeChat.lastMessage = action.payload;
        chatsData = reorderedChats;
      }

      return {
        ...state,
        messages: {
          ...state.messages,
          chats: {
            ...state.messages.chats,
            data: chatsData
          }
        }
      };
    case MessageActions.SET_CHATS:
      const unreadNum = getTotalNumOfUnread(action.payload.data);
      return {
        ...state,
        messages: {
          ...state.messages,
          chats: action.payload,
          unread: unreadNum,
        }
      };
    case MessageActions.SET_CONVER:
      return {
        ...state,
        messages: {
          ...state.messages,
          conver: action.payload
        }
      };
    case MessageActions.TRY_MARK_CONVER_AS_READ:
      const openedChat = getActiveChatById(action.payload, state.messages.chats ? state.messages.chats.data : undefined);
      let totUnreadNum = getTotalNumOfUnread(state.messages.chats ? state.messages.chats.data : undefined);
      if (openedChat) {
        totUnreadNum -= openedChat.totalUnread;
        openedChat.totalUnread = 0;
      }
      return {
        ...state,
        messages: {
          ...state.messages,
          chats: {
            ...state.messages.chats,
            openedChat
          },
          unread: totUnreadNum
        }
      };
    case MessageActions.SET_MESSAGE_UNREAD_COUNT:
      const updatedMessages = state.messages;
      updatedMessages.unread = action.payload;
      return {
        ...state,
        messages: updatedMessages,
      };
    case MessageActions.CLEAR_CONVER:
      return {
        ...state,
        messages: {
          ...state.messages,
          conver: null
        }
      };

    // NOTIFICATION ACTIONS
    case MessageActions.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload
      };
    case MessageActions.ADD_NOTIFICATION:
      const newNotifications = state.notifications;
      if (action.payload) {
        newNotifications.data.push(action.payload);
      }
      newNotifications.unread++;
      return {
        ...state,
        notifications: newNotifications
      };
    case MessageActions.SET_NOTI_AS_READ:
      let changedNotis = state.notifications;
      changedNotis = markAsRead(changedNotis, action.payload);
      changedNotis.unread--;
      return {
        ...state,
        notifications: changedNotis
      };
    case MessageActions.SET_NOTI_UNREAD_COUNT:
      const updatedNotis = state.notifications;
      updatedNotis.unread = action.payload;
      return {
        ...state,
        notifications: updatedNotis,
      };
    default:
      return state;
  }
}

function markAsRead(notifications: {
  data: {
    id: number,
    createdAt: Date,
    read: boolean,
    from: any,
    type: string,
    data: any
  }[],
  unread: number,
  total: number,
}, id: number) {

  if (notifications && notifications.data) {
    for (const noti of notifications.data) {
      if (noti.id === id) {
        noti.read = true;
        return notifications;
      }
    }
  }
  return notifications;
}

function getActiveChatByMessage(message: Message, chats: Chat[]): Chat {
  if (message && chats) {
    for (const chat of chats) {
      if (chat && (message.senderId === chat.id || message.receiverId === chat.id)) {
        return chat;
      }
    }
  }
  return undefined;
}

export function getActiveChatById(receiverId: Number, chats: Chat[]): Chat {
  if (chats) {
    for (const chat of chats) {
      if (chat && receiverId === chat.id) {
        return chat;
      }
    }
  }
  return undefined;
}

function reorderChats(message: Message, chats: Chat[]): Chat[] {
  const activeChat = getActiveChatByMessage(message, chats);
  if (activeChat) {
    return chats.sort(function (x, y) {
      return x === activeChat ? -1 : y === activeChat ? 1 : 0;
    });
  } else {
    return undefined;
  }
}

function getTotalNumOfUnread(chats: Chat[]) {
  let count = 0;
  if (chats) {
    for (const chat of chats) {
      count += chat.totalUnread;
    }
  }
  return count;
}
