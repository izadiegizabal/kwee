import {Action} from '@ngrx/store';

export const TRY_POST_MESSAGE = 'TRY_POST_MESSAGE';
export const POST_MESSAGE = 'POST_MESSAGE';
export const TRY_GET_MESSAGES = 'TRY_GET_MESSAGES';
export const GET_MESSAGES = 'GET_MESSAGES';
export const TRY_GET_NOTIFICATIONS = 'TRY_GET_NOTIFICATIONS';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const SET_NOTI_AS_READ = 'SET_NOTI_AS_READ';
export const TRY_SET_NOTI_AS_READ = 'TRY_SET_NOTI_AS_READ';
export const SET_NOTI_UNREAD_COUNT = 'SET_NOTI_UNREAD_COUNT';
export const TRY_GET_CONVERSATION = 'TRY_GET_CONVERSATION';
export const GET_CONVERSATION = 'GET_CONVERSATION';
export const OPERATION_ERROR = 'OPERATION_ERROR';
export const CLEAR = 'CLEAR';

export class Clear implements Action {
  readonly type = CLEAR;

  constructor() {
  }
}

export class TryPostMessage implements Action {
  readonly type = TRY_POST_MESSAGE;

  constructor(public payload: { obj: any }) {
  }
}

export class PostMessage implements Action {
  readonly type = POST_MESSAGE;

  constructor(public payload: any) {
  }
}

export class TryGetMessages implements Action {
  readonly type = TRY_GET_MESSAGES;

  constructor(public payload: any) {
  }
}

export class GetMessages implements Action {
  readonly type = GET_MESSAGES;

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

export class TryGetConversation implements Action {
  readonly type = TRY_GET_CONVERSATION;

  constructor(public payload: { id: number }) {
  }
}

export class GetConversation implements Action {
  readonly type = GET_CONVERSATION;

  constructor(public payload: any) {
  }
}

export class OperationError implements Action {
  readonly type = OPERATION_ERROR;

  constructor(public payload: any) {
  }
}

export type MessageActions =
  TryGetNotifications | SetNotifications | AddNotification | SetNotificationUnreadCount | SetNotiAsRead | TrySetNotiAsRead |
  TryPostMessage | PostMessage |
  TryGetMessages | GetMessages |
  TryGetConversation | GetConversation |
  OperationError | Clear;
