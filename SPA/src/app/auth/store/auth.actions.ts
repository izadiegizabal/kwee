import {Action} from '@ngrx/store';
import {UPDATE_CANDIDATE} from '../../admin/store/admin.actions';


export const TRY_SIGNUP_CANDIDATE = 'TRY_SIGNUP_CANDIDATE';
export const TRY_SIGNUP_BUSINESS = 'TRY_SIGNUP_BUSINESS';
export const TRY_SIGNIN = 'TRY_SIGNIN';
export const TRY_SIGNIN_SN = 'TRY_SIGNIN_SN';
export const SIGNUP = 'SIGNUP';
export const SIGNIN = 'SIGNIN';
export const LOGOUT = 'LOGOUT';
export const AUTH_ERROR = 'AUTH_ERROR';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER = 'SET_USER';
export const TRY_SN_CANDIDATE = 'TRY_SN_CANDIDATE';
export const SN_CANDIDATE = 'SN_CANDIDATE';

export class TrySignupCandidate implements Action {
  readonly type = TRY_SIGNUP_CANDIDATE;

  constructor(public payload: {
    name: string,
    password: string,
    email: string,
    city: string,
    dateBorn: Date,
    premium: string,
    rol: string
  }) {
  }
}

export class TrySignupBusiness implements Action {
  readonly type = TRY_SIGNUP_BUSINESS;

  constructor(public payload: { email: string, password: string, token: string }) {
  }
}

export class TrySignin implements Action {
  readonly type = TRY_SIGNIN;

  constructor(public payload: { email: string, password: string, token: any }) {
  }
}
export class Signup implements Action {
  readonly type = SIGNUP;
}

export class Signin implements Action {
  readonly type = SIGNIN;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class SetToken implements Action {
  readonly type = SET_TOKEN;

  constructor(public payload: string) {
  }
}

export class SetUser implements Action {
  readonly type = SET_USER;

  constructor(public payload: {
    email: string,
    id: number,
    name: string,
    type: string,
    notifications: number,
    premium: number,
  }) {
  }
}

export class AuthError implements Action {
  readonly type = AUTH_ERROR;

  constructor(public payload: any) {
  }
}

export class TrySigninSN implements Action {
  readonly type = TRY_SIGNIN_SN;

  constructor(public payload: { token: any, user: any, type: string}) {
  }
}


export class TrySNCandidate implements Action {
  readonly type = TRY_SN_CANDIDATE;

  constructor(public payload: { type: string, user: any, token: any }) {
  }
}

export class SnCandidate implements Action {
  readonly type = SN_CANDIDATE;

  constructor(public payload: {
    email: string,
    id: number,
    name: string,
    type: string,
    notifications: number,
    premium: number,
  }) {
  }
}



export type AuthActions = TrySignupCandidate | TrySignupBusiness
  | Signup | TrySignin | Signin | Logout | SetToken | SetUser | AuthError | TrySNCandidate | SnCandidate | TrySigninSN;
