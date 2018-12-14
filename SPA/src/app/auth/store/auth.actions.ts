import {Action} from '@ngrx/store';



export const TRY_SIGNUP = 'TRY_SIGNUP';
export const SIGNUP = 'SIGNUP';
export const TRY_SIGNIN = 'TRY_SIGNIN';
export const SIGNIN = 'SIGNIN';
export const LOGOUT = 'LOGOUT';
export const AUTH_ERROR = 'AUTH_ERROR';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_USER = 'SET_USER';

export class TrySignup implements Action {
  readonly type = TRY_SIGNUP;

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
  }) {}
}

export type AuthActions = TrySignup | Signup | TrySignin | Signin | Logout | SetToken | SetUser;
