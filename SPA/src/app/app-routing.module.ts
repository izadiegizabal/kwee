import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {CandidateHomeComponent} from './candidate-home/candidate-home.component';
import {OfferDetailComponent} from './shared/offer-detail/offer-detail.component';

const routes: Routes = [
  {path: '', redirectTo: '/candidate-home', pathMatch: 'full'},
  {path: 'candidate-home', component: CandidateHomeComponent},
  {path: 'offer/:id/:name', component: OfferDetailComponent},
  {path: 'admin', loadChildren: './admin/admin.module#AdminModule'},
  {path: 'signup', loadChildren: './auth/signup/signup.module#SignupModule'},
  {path: 'signin', loadChildren: './auth/signin/signin.module#SigninModule'},
  {path: 'email-verified/:token', loadChildren: './shared/email-verified/email-verified.module#EmailVerifiedModule'},
  {path: 'reset-password/:token', loadChildren: './shared/reset-password/reset-password.module#ResetPasswordModule'},
  {path: 'candidate/:id/:name', loadChildren: './shared/profiles/candidate-profile/candidate-profile.module#CandidateProfileModule'},
  {path: '**', redirectTo: '/candidate-home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
