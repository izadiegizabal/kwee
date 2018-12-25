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
  ],
  imports: [
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    OffererNameOverviewModule,
    StoreModule.forFeature('admin', adminReducer),
    EffectsModule.forFeature([AdminEffects])
  ],
})
export class AdminModule {

}
