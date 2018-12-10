import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
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
import {CandidateHomeComponent} from './candidate-home/candidate-home.component';

const routes: Routes = [
  {path: '', redirectTo: '/candidate-home', pathMatch: 'full'},
  {path: 'candidate-home', component: CandidateHomeComponent},
  {path: 'offerpreviewcard', component: OfferPreviewCardComponent},
  {path: 'smallcard', component: SmallcardComponent},
  {path: 'admin', loadChildren: './admin/admin.module#AdminModule'},
  {path: 'signup', loadChildren: './auth/signup/signup.module#SignupModule'},
  {path: 'signin', component: SigninComponent},
  {path: '**', redirectTo: '/candidate-home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
