import {ActionReducerMap} from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducers';
import * as fromAdmin from '../admin/store/admin.reducers';
import * as fromOffers from '../candidate-home/store/offers.reducers';

export interface AppState {
  // List different app states like auth etc...
  auth: fromAuth.State;
  admin: fromAdmin.State;
  offers: fromOffers.State;
}

export const reducers: ActionReducerMap<AppState> = {
  // List reducers for the states of the interface
  auth: fromAuth.authReducer,
  admin: fromAdmin.adminReducer,
  offers: fromOffers.offersReducer,
};
