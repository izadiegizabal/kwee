import {Action} from '@ngrx/store';

export const TRY_GET_PROFILE_CANDIDATE = 'TRY_GET_PROFILE_CANDIDATE';
export const SET_PROFILE_CANDIDATE = 'SET_PROFILE_CANDIDATE';
export const TRY_GET_PROFILE_BUSINESS = 'TRY_GET_PROFILE_BUSINESS';
export const SET_PROFILE_BUSINESS = 'SET_PROFILE_BUSINESS';
export const USER_TRY_UPDATE_CANDIDATE = 'USER_TRY_UPDATE_CANDIDATE';
export const USER_TRY_UPDATE_BUSINESS = 'USER_TRY_UPDATE_BUSINESS';
export const USER_UPDATE_CANDIDATE = 'USER_UPDATE_CANDIDATE';
export const USER_UPDATE_BUSINESS = 'USER_UPDATE_BUSINESS';
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

export class TryGetProfileBusiness implements Action {
  readonly type = TRY_GET_PROFILE_BUSINESS;

  constructor(public payload: { id: number }) {
  }
}

export class SetProfileBusiness implements Action {
  readonly type = SET_PROFILE_BUSINESS;

  constructor(public payload: any) {
  }
}

export class OperationError implements Action {
  readonly type = OPERATION_ERROR;

  constructor(public payload: any) {
  }
}


export class UserTryUpdateCandidate implements Action {
  readonly type = USER_TRY_UPDATE_CANDIDATE;

  constructor(public payload: { updatedCandidate: any }) {
  }
}

export class UserTryUpdateBusiness implements Action {
  readonly type = USER_TRY_UPDATE_BUSINESS;

  constructor(public payload: {updatedBusiness: any }) {
  }
}

export class UserUpdateCandidate implements Action {
  readonly type = USER_UPDATE_CANDIDATE;

  constructor(public payload: { updatedCandidate: any }) {
  }
}


export class UserUpdateBusiness implements Action {
  readonly type = USER_UPDATE_BUSINESS;

  constructor(public payload: { updatedBusiness: any }) {
  }
}

export type ProfilesActions =
  TryGetProfileCandidate |
  SetProfileCandidate |
  TryGetProfileBusiness |
  SetProfileBusiness |
  UserTryUpdateCandidate | UserTryUpdateBusiness |
  UserUpdateCandidate | UserUpdateBusiness |
  OperationError;
