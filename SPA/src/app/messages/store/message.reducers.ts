import * as MessageActions from './message.actions';

export interface State {
  messages: {
    senderId: number,
    senderName: string,
    receiverId: number,
    receiverName: string,
    message: string,
    date: string,
    hour: string,
    total: number,
    data: any
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
  messages: null,
  notifications: {
    data: null,
    unread: 0,
    total: 0,
  },
};

export function messageReducer(state = initialState, action: MessageActions.MessageActions) {
  switch (action.type) {
    case MessageActions.POST_MESSAGE:
      return {
        ...state,
        messages: action.payload
      };
    case MessageActions.GET_MESSAGES:
      return {
        ...state,
        messages: action.payload
      };
    case MessageActions.GET_CONVERSATION:
      return {
        ...state,
        messages: action.payload
      };
    case MessageActions.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload
      };
    case MessageActions.ADD_NOTIFICATION:
      const newNotifications = state.notifications;
      newNotifications.data.push(action.payload);
      return {
        ...state,
        notifications: newNotifications
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
        messages: {}
      };
    default:
      return state;
  }
}
