import {NgModule} from '@angular/core';
import {AdminComponent} from './admin.component';
import {AdminStatisticsComponent} from './admin-statistics/admin-statistics.component';
import {AdminManageCandidatesComponent} from './admin-manage-candidates/admin-manage-candidates.component';
import {AdminManageBusinessesComponent} from './admin-manage-businesses/admin-manage-businesses.component';
import {AdminVerifyComponent} from './admin-verify/admin-verify.component';
import {AdminReportsComponent} from './admin-reports/admin-reports.component';
import {AdminMessagesComponent} from './admin-messages/admin-messages.component';
import {CandidateOverviewComponent} from './admin-manage-candidates/candidate-overview/candidate-overview.component';
import {BusinessOverviewComponent} from './admin-manage-businesses/business-overview/business-overview.component';
import {AdminRoutingModule} from './admin-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {OffererNameOverviewModule} from '../shared/offerer-name-overview/offerer-name-overview.module';
import {StoreModule} from '@ngrx/store';
import {adminReducer} from './store/admin.reducers';
import {EffectsModule} from '@ngrx/effects';
import {AdminEffects} from './store/admin.effects';
import {AlertDialogComponent} from '../shared/alert-dialog/alert-dialog.component';
import {AlertDialogModule} from '../shared/alert-dialog/alert-dialog.module';
import {AdminManageOffersComponent} from './admin-manage-offers/admin-manage-offers.component';
import {OfferOverviewComponent} from './admin-manage-offers/offer-overview/offer-overview.component';
import {UserLogComponent} from './user-log/user-log.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminStatisticsComponent,
    AdminManageCandidatesComponent,
    AdminManageBusinessesComponent,
    AdminVerifyComponent,
    AdminReportsComponent,
    AdminMessagesComponent,
    CandidateOverviewComponent,
    BusinessOverviewComponent,
    AdminManageOffersComponent,
    OfferOverviewComponent,
    UserLogComponent,
  ],
  imports: [
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    AlertDialogModule,
    OffererNameOverviewModule,
    StoreModule.forFeature('admin', adminReducer),
    EffectsModule.forFeature([AdminEffects])
  ],
  entryComponents: [
    AlertDialogComponent,
  ],
})
export class AdminModule {

}
