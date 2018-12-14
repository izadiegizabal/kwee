import {Action} from '@ngrx/store';


export const TRY_SIGNUP_CANDIDATE = 'TRY_SIGNUP_CANDIDATE';
export const TRY_SIGNUP_BUSINESS = 'TRY_SIGNUP_BUSINESS';
export const SIGNUP = 'SIGNUP';
export const TRY_SIGNIN = 'TRY_SIGNIN';
export const SIGNIN = 'SIGNIN';
export const LOGOUT = 'LOGOUT';
export const AUTH_ERROR = 'AUTH_ERROR';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER = 'SET_USER';

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

  constructor(public payload: { email: string, password: string }) {
  }
}

export class TrySignin implements Action {
  readonly type = TRY_SIGNIN;

  constructor(public payload: { email: string, password: string }) {
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
    name: string
  }) {
  }
}

export class AuthError implements Action {
  readonly type = AUTH_ERROR;

  constructor(public payload: any) {
  }
}

export type AuthActions = TrySignupCandidate | TrySignupBusiness | Signup | TrySignin | Signin | Logout | SetToken | SetUser | AuthError;
