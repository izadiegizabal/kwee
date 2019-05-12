import {Action} from '@ngrx/store';

export const TRY_GET_OFFERS = 'TRY_GET_OFFERS';
export const SET_OFFERS = 'SET_OFFERS';
export const OPERATION_ERROR = 'OPERATION_ERROR';


export class TryGetOffers implements Action {
  readonly type = TRY_GET_OFFERS;

  constructor(public payload: { page: number, limit: number, params: string, order: string}) {
  }
}

export class SetOffers implements Action {
  readonly type = SET_OFFERS;

  constructor(public payload: any) {
  }
}

export class OperationError implements Action {
  readonly type = OPERATION_ERROR;

  constructor(public payload: any) {
  }
}

export type OffersActions =
  TryGetOffers |
  SetOffers |
  OperationError;
