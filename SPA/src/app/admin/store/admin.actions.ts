import {Action} from '@ngrx/store';

export const TRY_GET_CANDIDATES = 'TRY_GET_CANDIDATES';
export const TRY_GET_BUSINESSES = 'TRY_GET_BUSINESSES';
export const TRY_UPDATE_CANDIDATE = 'TRY_UPDATE_CANDIDATE';
export const TRY_UPDATE_BUSINESS = 'TRY_UPDATE_BUSINESS';
export const TRY_DELETE_CANDIDATE = 'TRY_DELETE_CANDIDATE';
export const TRY_DELETE_BUSINESS = 'TRY_DELETE_BUSINESS';
export const UPDATE_CANDIDATE = 'UPDATE_CANDIDATE';
export const UPDATE_BUSINESS = 'UPDATE_BUSINESS';
export const SET_CANDIDATES = 'SET_CANDIDATES';
export const SET_BUSINESSES = 'SET_BUSINESSES';
export const DELETE_CANDIDATE = 'DELETE_CANDIDATE';
export const DELETE_BUSINESS = 'DELETE_BUSINESS';
export const OPERATION_ERROR = 'OPERATION_ERROR';

export class TryGetCandidates implements Action {
  readonly type = TRY_GET_CANDIDATES;

  constructor(public payload: { page: number, limit: number, params: string, order: string }) {
  }
}

export class TryGetBusinesses implements Action {
  readonly type = TRY_GET_BUSINESSES;

  constructor(public payload: { page: number, limit: number, params: string, order: string }) {
  }
}

export class SetCandidates implements Action {
  readonly type = SET_CANDIDATES;

  constructor(public payload: any) {
  }
}

export class SetBusinesses implements Action {
  readonly type = SET_BUSINESSES;

  constructor(public payload: any) {
  }
}

export class TryUpdateCandidate implements Action {
  readonly type = TRY_UPDATE_CANDIDATE;

  constructor(public payload: { id: number, updatedCandidate: any }) {
  }
}

export class TryUpdateBusiness implements Action {
  readonly type = TRY_UPDATE_BUSINESS;

  constructor(public payload: { id: number, updatedBusiness: any }) {
  }
}

export class UpdateCandidate implements Action {
  readonly type = UPDATE_CANDIDATE;

  constructor(public payload: { id: number, updatedCandidate: any }) {
  }
}

export class UpdateBusiness implements Action {
  readonly type = UPDATE_BUSINESS;

  constructor(public payload: { id: number, updatedBusiness: any }) {
  }
}

export class TryDeleteCandidate implements Action {
  readonly type = TRY_DELETE_CANDIDATE;

  // @payload = id to delete
  constructor(public payload: number) {
  }
}

export class TryDeleteBusiness implements Action {
  readonly type = TRY_DELETE_BUSINESS;

  // @payload = id to delete
  constructor(public payload: number) {
  }
}

export class DeleteCandidate implements Action {
  readonly type = DELETE_CANDIDATE;

  // @payload = id to delete
  constructor(public payload: number) {
  }
}

export class DeleteBusiness implements Action {
  readonly type = DELETE_BUSINESS;

  // @payload = id to delete
  constructor(public payload: number) {
  }
}

export class OperationError implements Action {
  readonly type = OPERATION_ERROR;

  constructor(public payload: any) {
  }
}

export type AdminActions =
  TryGetCandidates | TryGetBusinesses |
  SetCandidates | SetBusinesses |
  TryUpdateCandidate | TryUpdateBusiness |
  UpdateCandidate | UpdateBusiness |
  TryDeleteCandidate | TryDeleteBusiness |
  DeleteCandidate | DeleteBusiness |
  OperationError;


