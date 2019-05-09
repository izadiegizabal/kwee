import {Action} from '@ngrx/store';

export const TRY_GET_OFFERS = 'TRY_GET_OFFERS';
export const SET_OFFERS = 'SET_OFFERS';
export const TRY_UPDATE_OFFER = 'TRY_UPDATE_OFFER';
export const UPDATE_OFFER = 'UPDATE_OFFER';
export const TRY_DELETE_OFFER = 'TRY_DELETE_OFFER';
export const DELETE_OFFER = 'DELETE_OFFER';
export const OPERATION_ERROR = 'OPERATION_ERROR';


export class TryGetOffers implements Action {
  readonly type = TRY_GET_OFFERS;

  constructor(public payload: { page: number, limit: number, params: string, order: string }) {
  }
}

export class SetOffers implements Action {
  readonly type = SET_OFFERS;

  constructor(public payload: any) {
  }
}


export class TryUpdateOffer implements Action {
  readonly type = TRY_UPDATE_OFFER;

  constructor(public payload: { id: number, updateoffer: any }) {
  }
}

export class UpdateOffer implements Action {
  readonly type = UPDATE_OFFER;

  constructor(public payload: { id: number, updateoffer: any }) {
  }
}

export class TryDeleteOffer implements Action {
  readonly type = TRY_DELETE_OFFER;

  constructor(public payload: number) {
  }
}

export class DeleteOffer implements Action {
  readonly type = DELETE_OFFER;

  constructor(public payload: number) {
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
  TryUpdateOffer |
  UpdateOffer |
  TryDeleteOffer |
  DeleteOffer |
  OperationError;
