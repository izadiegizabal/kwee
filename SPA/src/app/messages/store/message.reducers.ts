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
}

const initialState: State = {
  messages: null,
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
    case MessageActions.CLEAR:
      return {
        ...state,
        messages: {}
      };
    default:
      return state;
  }
}
