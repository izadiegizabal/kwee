import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OfferPreviewCardComponent} from './offer/offer-preview-card/offer-preview-card.component';
import {SmallcardComponent} from './smallcard/smallcard.component';
import {SignupComponent} from './auth/signup/signup.component';
import {SigninComponent} from './auth/signin/signin.component';
import {AdminComponent} from './admin/admin.component';
import {AdminStatisticsComponent} from './admin/admin-statistics/admin-statistics.component';
import {AdminManageCandidatesComponent} from './admin/admin-manage-candidates/admin-manage-candidates.component';
import {AdminManageBusinessesComponent} from './admin/admin-manage-businesses/admin-manage-businesses.component';
import {AdminVerifyComponent} from './admin/admin-verify/admin-verify.component';
import {AdminReportsComponent} from './admin/admin-reports/admin-reports.component';
import {AdminMessagesComponent} from './admin/admin-messages/admin-messages.component';

const routes: Routes = [
  {path: '', redirectTo: '/offerpreviewcard', pathMatch: 'full'},
  {path: 'offerpreviewcard', component: OfferPreviewCardComponent, pathMatch: 'full'},
  {path: 'smallcard', component: SmallcardComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'admin', component: AdminComponent, children: [
      {path: '', redirectTo: 'statistics', pathMatch: 'full'},
      {path: 'statistics', component: AdminStatisticsComponent},
      {path: 'manage-candidates', component: AdminManageCandidatesComponent},
      {path: 'manage-businesses', component: AdminManageBusinessesComponent},
      {path: 'verify', component: AdminVerifyComponent},
      {path: 'reports', component: AdminReportsComponent},
      {path: 'messages', component: AdminMessagesComponent},
      {path: '**', redirectTo: 'statistics'}
    ]},
  {path: '**', redirectTo: '/offerpreviewcard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
