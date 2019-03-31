import {NgModule} from '@angular/core';
import {OfferManageCandidateComponent} from './offer-manage-candidate/offer-manage-candidate.component';
import {SharedModule} from '../../shared/shared.module';
import {OfferManageRoutingModule} from './offer-manage.routing.module';
import {OfferManageComponent} from './offer-manage.component';
import {OfferManageBusinessComponent} from './offer-manage-business/offer-manage-business.component';
import {OfferManageTabComponent} from './offer-manage-tab/offer-manage-tab.component';
import {OfferPreviewCardModule} from '../offer-preview-card/offer-preview-card.module';

import {StoreModule} from '@ngrx/store';
import {OfferManageReducer} from './store/offer-manage.reducers';
import {EffectsModule} from '@ngrx/effects';
import {OfferManageEffects} from './store/offer-manage.effects';
import {OfferSelectionProcessComponent} from './offer-selection-process/offer-selection-process.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CandidatePreviewCardModule} from '../../search-users/search-candidates/candidate-preview-card/candidate-preview-card.module';
import {SearchbarModule} from '../../shared/searchbar/searchbar.module';
import {AlertDialogModule} from '../../shared/alert-dialog/alert-dialog.module';
import {AlertDialogComponent} from '../../shared/alert-dialog/alert-dialog.component';

@NgModule({
  declarations: [
    OfferManageComponent,
    OfferManageCandidateComponent,
    OfferManageBusinessComponent,
    OfferManageTabComponent,
    OfferSelectionProcessComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    CandidatePreviewCardModule,
    SearchbarModule,
    OfferManageRoutingModule,
    OfferPreviewCardModule,
    AlertDialogModule,
    StoreModule.forFeature('offerManage', OfferManageReducer),
    EffectsModule.forFeature([OfferManageEffects])
  ],
  entryComponents: [
    AlertDialogComponent,
  ],
})
export class OfferManageModule {

}
