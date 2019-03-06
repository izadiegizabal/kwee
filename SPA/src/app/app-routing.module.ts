import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {CandidateHomeComponent} from './candidate-home/candidate-home.component';
import {OfferDetailComponent} from './offer/offer-detail/offer-detail.component';
import {PrivacyComponent} from './privacy/privacy.component';
import {AuthTokenGuard} from './auth/guards/auth-token-guard.service';
import {AdminGuard} from './auth/guards/admin-guard.service';
import {VisitorGuard} from './auth/guards/visitor-guard.service';

const routes: Routes = [

  // MAIN PAGES
  {path: '', redirectTo: '/candidate-home', pathMatch: 'full'}, // TODO: canActivate -> redirect to candidate-home or business-home
  {path: 'candidate-home', component: CandidateHomeComponent},

  // PROFILES
  {path: 'candidate/:id/:name', loadChildren: './profiles/candidate-profile/candidate-profile.module#CandidateProfileModule'},
  {path: 'business/:id/:name', loadChildren: './profiles/business-profile/business-profile.module#BusinessProfileModule'},

  // OFFERS
  {
    path: 'my-offers',
    loadChildren: './offer/offer-manage/offer-manage.module#OfferManageModule',
    canActivate: [AuthTokenGuard]
  },
  {path: 'offer/:id/:name', component: OfferDetailComponent},
  { // TODO: canActivate -> Business & Admin
    path: 'offer/create',
    loadChildren: './offer/offer-create/offer-create.module#OfferCreateModule'
  },
  { // TODO: canActivate -> Offer Owner & Admin
    path: 'offer/:id/edit',
    loadChildren: './offer/offer-create/offer-create.module#OfferCreateModule'
  },

  // DIRECTORIES
  {
    path: 'search-businesses',
    loadChildren: './search-users/search-businesses/search-businesses.module#SearchBusinessesModule',
    canActivate: [AuthTokenGuard]
  },
  {
    path: 'search-candidates',
    loadChildren: './search-users/search-candidates/search-candidates.module#SearchCandidatesModule',
    canActivate: [AuthTokenGuard]
  },

  // TESTING PAGES -> TODO: delete this once not needed
  {path: 'paypal', loadChildren: './paypal/paypal.module#PaypalModule'},

  // AUTH
  {
    path: 'signup',
    loadChildren: './auth/signup/signup.module#SignupModule',
    canActivate: [VisitorGuard],
  },
  {
    path: 'signin',
    loadChildren: './auth/signin/signin.module#SigninModule',
    canActivate: [VisitorGuard],
  },

  // ADMINISTRATION
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: [AdminGuard]
  },

  // KWEE LIVE
  {path: 'kwee-live', loadChildren: './kwee-live/kwee-live.module#KweeLiveModule'},

  // OTHERS
  {path: 'privacy', component: PrivacyComponent},
  {path: 'email-verified/:token', loadChildren: './email-verified/email-verified.module#EmailVerifiedModule'},
  {path: 'reset-password/:token', loadChildren: './reset-password/reset-password.module#ResetPasswordModule'},
  {path: 'contact-support', loadChildren: './contact-support/contact-support.module#ContactSupportModule'},
  {path: 'error', loadChildren: './errors/errors.module#ErrorsModule'},

  // If matching path not found show Error 404
  {path: '**', redirectTo: 'error/404'}
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