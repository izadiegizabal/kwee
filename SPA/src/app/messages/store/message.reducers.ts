import * as MessageActions from './message.actions';

export interface Chat {
  id: number;
  name: string;
  lastMessage: Message;
  message: string;
  date: string;
  hour: string;
  img: string;
}

export interface Message {
  _id: string;
  senderId: number;
  receiverId: number;
  receiverName: string;
  message: string;
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
  },
  notifications: {
    data: null,
    unread: 0,
    total: 0,
  },
};

function getActiveChat(message: Message, chats: Chat[]): Chat {
  for (const chat of chats) {
    if (message.senderId === chat.id || message.receiverId === chat.id) {
      return chat;
    }
  }
  return undefined;
}

function reorderChats(message: Message, chats: Chat[]): Chat[] {
  const activeChat = getActiveChat(message, chats);
  if (activeChat) {
    return chats.sort(function (x, y) {
      return x === activeChat ? -1 : y === activeChat ? 1 : 0;
    });
  } else {
    return undefined;
  }
}

export function messageReducer(state = initialState, action: MessageActions.MessageActions) {
  switch (action.type) {
    case MessageActions.TRY_POST_MESSAGE:
      const newData = state.messages.conver.data.push(action.payload);
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
        const activeChat = getActiveChat(action.payload, state.messages.chats.data);
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
      return {
        ...state,
        messages: {
          ...state.messages,
          chats: action.payload
        }
      };
    case MessageActions.GET_CONVERSATION:
      return {
        ...state,
        messages: {
          ...state.messages,
          conver: action.payload
        }
      };
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
    case MessageActions.CLEAR:
      return {
        ...state,
        messages: null,
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

  if (notifications.data) {
    for (const noti of notifications.data) {
      if (noti.id === id) {
        noti.read = true;
        return notifications;
      }
    }
  }
  return notifications;
}
