import {Action} from '@ngrx/store';

export const TRY_GET_OFFER = 'TRY_GET_OFFER';
export const SET_OFFER = 'SET_OFFER';
export const TRY_POST_APPLICATION = 'TRY_POST_APPLICATION';
export const POST_APPLICATION = 'POST_APPLICATION';
export const OPERATION_ERROR = 'OPERATION_ERROR';


export class TryGetOffer implements Action {
  readonly type = TRY_GET_OFFER;

  constructor(public payload: { id: number }) {
  }
}

export class SetOffer implements Action {
  readonly type = SET_OFFER;

  constructor(public payload: any) {
  }
}

export class TryPostApplication implements Action {
  readonly type = TRY_POST_APPLICATION;

  constructor(public payload: { fk_offer: number }) {
  }
}

export class PostApplication implements Action {
  readonly type = POST_APPLICATION;
}


export class OperationError implements Action {
  readonly type = OPERATION_ERROR;

  constructor(public payload: any) {
  }
}


export type OfferActions =
  TryGetOffer |
  SetOffer |
  TryPostApplication |
  PostApplication |
  OperationError;
