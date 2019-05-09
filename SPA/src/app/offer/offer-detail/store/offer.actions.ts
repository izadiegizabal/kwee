import {Action} from '@ngrx/store';

export const TRY_GET_OFFER = 'TRY_GET_OFFER';
export const SET_OFFER = 'SET_OFFER';
export const TRY_POST_APPLICATION = 'TRY_POST_APPLICATION';
export const POST_APPLICATION = 'POST_APPLICATION';
export const SET_APPLICATION = 'SET_APPLICATION';
export const TRY_GET_APPLICATION = 'TRY_GET_APPLICATION';
export const DELETE_APPLICATION = 'DELETE_APPLICATION';
export const TRY_DELETE_APPLICATION = 'TRY_DELETE_APPLICATION';
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

  constructor(public payload: any) {
  }
}

export class TryGetApplication implements Action {
  readonly type = TRY_GET_APPLICATION;

  constructor(public payload: { id_offer: number, id_applicant: number }) {
  }
}

export class SetApplication implements Action {
  readonly type = SET_APPLICATION;

  constructor(public payload: any) {
  }
}

export class TryDeleteApplication implements Action {
  readonly type = TRY_DELETE_APPLICATION;

  constructor(public payload: { fk_application: Number }) {
  }
}

export class DeleteApplication implements Action {
  readonly type = DELETE_APPLICATION;

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
  TryPostApplication |
  PostApplication |
  TryGetApplication |
  SetApplication |
  TryDeleteApplication |
  DeleteApplication |
  OperationError;
