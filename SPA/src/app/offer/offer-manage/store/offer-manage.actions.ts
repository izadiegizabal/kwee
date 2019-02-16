import {Action} from '@ngrx/store';

export const TRY_GET_OFFERS_OFFERER = 'TRY_GET_OFFERS_OFFERER';
export const SET_OFFERS_OFFERER = 'SET_OFFERS_OFFERER';
export const TRY_GET_OFFERS_APPLICANT = 'TRY_GET_OFFERS_APPLICANT';
export const SET_OFFERS_APPLICANT = 'SET_OFFERS_APPLICANT';
export const OPERATION_ERROR = 'OPERATION_ERROR';


export class TryGetOffersOfferer implements Action {
  readonly type = TRY_GET_OFFERS_OFFERER;

  constructor(public payload: {id: number, page: number, limit: number, status: number}) {
  }
}

export class SetOffersOfferer implements Action {
  readonly type = SET_OFFERS_OFFERER;

  constructor(public payload: any) {
  }
}

export class TryGetOffersApplicant implements Action {
  readonly type = TRY_GET_OFFERS_APPLICANT;

  constructor(public payload: {id: number, page: number, limit: number, status: number}) {
  }
}

export class SetOffersApplicant implements Action {
  readonly type = SET_OFFERS_APPLICANT;

  constructor(public payload: any) {
  }
}

export class OperationError implements Action {
  readonly type = OPERATION_ERROR;

  constructor(public payload: any) {
  }
}

export type OfferManageActions =
  TryGetOffersOfferer |
  SetOffersOfferer |
  TryGetOffersApplicant |
  SetOffersApplicant |
  OperationError;
