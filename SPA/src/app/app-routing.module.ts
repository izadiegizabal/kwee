import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {CandidateHomeComponent} from './candidate-home/candidate-home.component';
import {OfferDetailComponent} from './offer/offer-detail/offer-detail.component';
import {PrivacyComponent} from './privacy/privacy.component';
import {OfferCreateComponent} from './offer/offer-create/offer-create.component';

const routes: Routes = [
  {path: '', redirectTo: '/candidate-home', pathMatch: 'full'},
  {path: 'candidate-home', component: CandidateHomeComponent},
  {path: 'privacy', component: PrivacyComponent},
  {path: 'offer/:id/:name', component: OfferDetailComponent},
  {path: 'offer/create', component: OfferCreateComponent},
  {path: 'admin', loadChildren: './admin/admin.module#AdminModule'},
  {path: 'paypal', loadChildren: './paypal/paypal.module#PaypalModule'},
  {path: 'signup', loadChildren: './auth/signup/signup.module#SignupModule'},
  {path: 'signin', loadChildren: './auth/signin/signin.module#SigninModule'},
  {path: 'email-verified/:token', loadChildren: './email-verified/email-verified.module#EmailVerifiedModule'},
  {path: 'reset-password/:token', loadChildren: './reset-password/reset-password.module#ResetPasswordModule'},
  {path: 'candidate/:id/:name', loadChildren: './profiles/candidate-profile/candidate-profile.module#CandidateProfileModule'},
  {path: 'business/:id/:name', loadChildren: './profiles/business-profile/business-profile.module#BusinessProfileModule'},
  {path: 'my-offers', loadChildren: './offer/offer-manage/offer-manage.module#OfferManageModule'},
  {path: 'kwee-live', loadChildren: './kwee-live/kwee-live.module#KweeLiveModule'},
  {path: '**', redirectTo: '/candidate-home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
