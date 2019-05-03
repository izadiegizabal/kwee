import {ActionReducerMap} from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducers';
import * as fromAdmin from '../admin/store/admin.reducers';
import * as fromOffers from '../offer/store/offers.reducers';
import * as fromOffer from '../offer/offer-detail/store/offer.reducers';
import * as fromProfiles from '../profiles/store/profiles.reducers';
import * as fromOfferManage from '../offer/offer-manage/store/offer-manage.reducers';
import * as fromInvoices from '../invoices/store/invoice.reducers';
import * as fromMessages from '../messages/store/message.reducers';
import * as fromKweeLive from '../kwee-live/store/kwee-live.reducers';

export interface AppState {
  // List different app states like auth etc...
  auth: fromAuth.State;
  admin: fromAdmin.State;
  offers: fromOffers.State;
  offer: fromOffer.State;
  profiles: fromProfiles.State;
  offerManage: fromOfferManage.State;
  invoices: fromInvoices.State;
  messages: fromMessages.State;
  kweeLive: fromKweeLive.State;
}

export const reducers: ActionReducerMap<AppState> = {
  // List reducers for the states of the interface
  auth: fromAuth.authReducer,
  admin: fromAdmin.adminReducer,
  offers: fromOffers.offersReducer,
  offer: fromOffer.offerReducer,
  profiles: fromProfiles.profilesReducer,
  offerManage: fromOfferManage.OfferManageReducer,
  invoices: fromInvoices.invoiceReducer,
  messages: fromMessages.messageReducer,
  kweeLive: fromKweeLive.kweeLiveReducer,
};
