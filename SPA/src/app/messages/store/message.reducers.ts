import * as MessageActions from './message.actions';
import {User} from '../messages.component';

export interface State {
  messages: {
    chats: {
      data: User[],
      total: number
    },
    conver: {
      data: {
        _id: string,
        senderId: number,
        receiverId: number,
        receiverName: string,
        message: string,
        date: string,
        hour: string,
        __v: number
      }[],
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

export function messageReducer(state = initialState, action: MessageActions.MessageActions) {
  switch (action.type) {
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
