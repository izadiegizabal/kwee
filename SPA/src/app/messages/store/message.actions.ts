import {Action} from '@ngrx/store';

export const TRY_POST_MESSAGE = 'TRY_POST_MESSAGE';
export const POST_MESSAGE = 'POST_MESSAGE';
export const TRY_GET_MESSAGES = 'TRY_GET_MESSAGES';
export const GET_MESSAGES = 'GET_MESSAGES';
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
  TryPostMessage | PostMessage |
  OperationError | TryGetMessages |
  GetMessages | TryGetConversation |
  GetConversation | Clear;
