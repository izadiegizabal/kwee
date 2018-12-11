import {ActionReducerMap} from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducers';

export interface AppState {
  // TODO: list different app states like auth etc...
  auth: fromAuth.State;
}

export const reducers: ActionReducerMap<AppState> = {
  // TODO: list reducers for the states of the interface
  auth: fromAuth.authReducer
};
