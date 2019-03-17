import {Action} from '@ngrx/store';

export const TRY_GET_PROFILE_CANDIDATE = 'TRY_GET_PROFILE_CANDIDATE';
export const SET_PROFILE_CANDIDATE = 'SET_PROFILE_CANDIDATE';
export const TRY_GET_PROFILE_OFFERER = 'TRY_GET_PROFILE_OFFERER';
export const SET_PROFILE_OFFERER = 'SET_PROFILE_OFFERER';
export const OPERATION_ERROR = 'OPERATION_ERROR';


export class TryGetProfileCandidate implements Action {
  readonly type = TRY_GET_PROFILE_CANDIDATE;

  constructor(public payload: { id: number }) {
  }
}

export class SetProfileCandidate implements Action {
  readonly type = SET_PROFILE_CANDIDATE;

  constructor(public payload: any) {
  }
}

export class TryGetProfileOfferer implements Action {
  readonly type = TRY_GET_PROFILE_OFFERER;

  constructor(public payload: { id: number }) {
  }
}

export class SetProfileOfferer implements Action {
  readonly type = SET_PROFILE_OFFERER;

  constructor(public payload: any) {
  }
}

export class OperationError implements Action {
  readonly type = OPERATION_ERROR;

  constructor(public payload: any) {
  }
}

export type ProfilesActions =
  TryGetProfileCandidate |
  SetProfileCandidate |
  TryGetProfileOfferer |
  SetProfileOfferer |
  OperationError;
