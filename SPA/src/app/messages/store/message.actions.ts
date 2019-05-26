import {Action} from '@ngrx/store';
import {Message} from './message.reducers';


export const TRY_POST_MESSAGE = 'TRY_POST_MESSAGE';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const POST_MESSAGE = 'POST_MESSAGE';
export const TRY_GET_CHATS = 'TRY_GET_CHATS';
export const SET_CHATS = 'SET_CHATS';
export const TRY_GET_NOTIFICATIONS = 'TRY_GET_NOTIFICATIONS';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const SET_NOTI_AS_READ = 'SET_NOTI_AS_READ';
export const TRY_SET_NOTI_AS_READ = 'TRY_SET_NOTI_AS_READ';
export const SET_NOTI_UNREAD_COUNT = 'SET_NOTI_UNREAD_COUNT';
export const SET_MESSAGE_UNREAD_COUNT = 'SET_MESSAGE_UNREAD_COUNT';
export const TRY_GET_CONVERSATION = 'TRY_GET_CONVERSATION';
export const SET_CONVER = 'SET_CONVER';
export const NEW_CONVER = 'NEW_CONVER';
export const MARK_CONVER_AS_READ = 'MARK_CONVER_AS_READ';
export const TRY_MARK_CONVER_AS_READ = 'TRY_MARK_CONVER_AS_READ';
export const OPERATION_ERROR = 'OPERATION_ERROR';
export const CLEAR_CONVER = 'CLEAR_CONVER';

export class ClearConver implements Action {
  readonly type = CLEAR_CONVER;

  constructor() {
  }
}

export class TryPostMessage implements Action {
  readonly type = TRY_POST_MESSAGE;

  constructor(public payload: Message) {
  }
}

export class AddMessage implements Action {
  readonly type = ADD_MESSAGE;

  constructor(public payload: Message) {
  }
}

export class PostMessage implements Action {
  readonly type = POST_MESSAGE;

  constructor(public payload: any) {
  }
}

export class TryGetConvers implements Action {
  readonly type = TRY_GET_CHATS;

  constructor() {
  }
}

export class TryMarkConverRead implements Action {
  readonly type = TRY_MARK_CONVER_AS_READ;

  constructor(public payload: number) {
  }
}

export class MarkConverRead implements Action {
  readonly type = MARK_CONVER_AS_READ;

  constructor(public payload: number) {
  }
}

export class GetMessages implements Action {
  readonly type = SET_CHATS;

  constructor(public payload: any) {
  }
}

export class TryGetNotifications implements Action {
  readonly type = TRY_GET_NOTIFICATIONS;

  constructor(public payload: { page: number, limit: number }) {
  }
}

export class SetNotifications implements Action {
  readonly type = SET_NOTIFICATIONS;

  constructor(public payload: any) {
  }
}

export class AddNotification implements Action {
  readonly type = ADD_NOTIFICATION;

  constructor(public payload: any) {
  }
}

export class TrySetNotiAsRead implements Action {
  readonly type = TRY_SET_NOTI_AS_READ;

  constructor(public payload: number) {
  }
}

export class SetNotiAsRead implements Action {
  readonly type = SET_NOTI_AS_READ;

  constructor(public payload: number) {
  }
}

export class SetNotificationUnreadCount implements Action {
  readonly type = SET_NOTI_UNREAD_COUNT;

  constructor(public payload: number) {
  }
}

export class SetMessageUnreadCount implements Action {
  readonly type = SET_MESSAGE_UNREAD_COUNT;

  constructor(public payload: number) {
  }
}

export class TryGetConversation implements Action {
  readonly type = TRY_GET_CONVERSATION;

  constructor(public payload: number) {
  }
}

export class GetConversation implements Action {
  readonly type = SET_CONVER;

  constructor(public payload: any) {
  }
}

export class NewConversation implements Action {
  readonly type = NEW_CONVER;

  constructor(public payload: number) {
  }
}

export class OperationError implements Action {
  readonly type = OPERATION_ERROR;

  constructor(public payload: any) {
  }
}

export type MessageActions =
  TryGetNotifications | SetNotifications | AddNotification | SetNotificationUnreadCount | SetNotiAsRead | TrySetNotiAsRead |
  TryPostMessage | PostMessage | AddMessage | SetMessageUnreadCount |
  TryGetConvers | GetMessages | NewConversation |
  TryGetConversation | GetConversation | MarkConverRead | TryMarkConverRead |
  OperationError | ClearConver;
