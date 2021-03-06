import * as AuthActions from './auth.actions';

export interface State {
  token: string;
  authenticated: boolean;
  user: {
    email: string,
    id: number,
    name: string,
    type: string,
    notifications: number,
    messages: number,
    premium: number,
  };
}

const initialState: State = {
  token: null,
  authenticated: false,
  user: null
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.SIGNUP:
    case AuthActions.SIGNIN:
      return {
        ...state,
        authenticated: true
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        token: null,
        authenticated: false,
        user: null,
      };
    case AuthActions.SET_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case AuthActions.SET_USER:
      return {
        ...state,
        user: action.payload
      };
    case AuthActions.SN_USER:
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
}
