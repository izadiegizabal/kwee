import {Action} from '@ngrx/store';

export const TRY_GET_CANDIDATES = 'TRY_GET_CANDIDATES';
export const TRY_GET_BUSINESSES = 'TRY_GET_BUSINESSES';
export const SET_CANDIDATES = 'SET_CANDIDATES';
export const SET_BUSINESSES = 'SET_BUSINESSES';

export class TryGetCandidates implements Action {
  readonly type = TRY_GET_CANDIDATES;
}

export class SetCandidates implements Action {
  readonly type = SET_CANDIDATES;

  constructor(public payload: any) {
  }
}

export class TryGetBusinesses implements Action {
  readonly type = TRY_GET_BUSINESSES;
}

export class SetBusinesses implements Action {
  readonly type = SET_BUSINESSES;

  constructor(public payload: any) {
  }
}

export type AdminActions = TryGetCandidates | TryGetBusinesses | SetCandidates | SetBusinesses;


