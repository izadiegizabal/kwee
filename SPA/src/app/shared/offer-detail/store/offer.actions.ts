import {Action} from '@ngrx/store';

export const TRY_GET_OFFER = 'TRY_GET_OFFER';
export const SET_OFFER = 'SET_OFFER';
export const OPERATION_ERROR = 'OPERATION_ERROR';


export class TryGetOffer implements Action {
  readonly type = TRY_GET_OFFER;
}

export class SetOffer implements Action {
  readonly type = SET_OFFER;

  constructor(public payload: any) {
  }
}

export class OperationError implements Action {
  readonly type = OPERATION_ERROR;

  constructor(public payload: any) {
  }
}

export type OfferActions =
  TryGetOffer |
  SetOffer |
  OperationError;
