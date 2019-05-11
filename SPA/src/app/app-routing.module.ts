import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {CandidateHomeComponent} from './candidate-home/candidate-home.component';
import {OfferDetailComponent} from './offer/offer-detail/offer-detail.component';
import {PrivacyComponent} from './privacy/privacy.component';
import {AuthTokenGuard} from './auth/guards/auth-token-guard.service';
import {AdminGuard} from './auth/guards/admin-guard.service';
import {VisitorGuard} from './auth/guards/visitor-guard.service';
import {LandingComponent} from './landing/landing.component';
import {HomeRedirectGuardService} from './auth/guards/home-redirect-guard.service';

const routes: Routes = [

  // MAIN PAGES
  {path: '', redirectTo: '', canActivate: [HomeRedirectGuardService], pathMatch: 'full'},
  {path: 'home', component: LandingComponent, data: {animation: 'isLeft'}},
  {path: 'candidate-home', component: CandidateHomeComponent, data: {animation: 'isLeft'}},

  // PROFILES
  {
    path: 'candidate/:id/:name',
    loadChildren: './profiles/candidate-profile/candidate-profile.module#CandidateProfileModule',
    data: {animation: 'isRight'}
  },
  {
    path: 'business/:id/:name',
    loadChildren: './profiles/business-profile/business-profile.module#BusinessProfileModule',
    data: {animation: 'isRight'}
  },

  // OFFERS
  {
    path: 'my-offers',
    loadChildren: './offer/offer-manage/offer-manage.module#OfferManageModule',
  },
  { // TODO: canActivate -> Offer Owner & Admin
    path: 'offer/:id/edit',
    loadChildren: './offer/offer-create/offer-create.module#OfferCreateModule'
  },
  { // TODO: canActivate -> Business & Admin
    path: 'offer/create',
    loadChildren: './offer/offer-create/offer-create.module#OfferCreateModule'
  },
  {path: 'offer/:id/:name', component: OfferDetailComponent},

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
  // NOTIFICATIONS
  {
    path: 'notifications',
    loadChildren: './notifications/notifications.module#NotificationsModule',
    canActivate: [AuthTokenGuard]
  },
  // MESSAGES
  {
    path: 'messages',
    loadChildren: './messages/messages.module#MessagesModule',
    canActivate: [AuthTokenGuard]
  },
  // KWEE LIVE
  {path: 'kwee-live', loadChildren: './kwee-live/kwee-live.module#KweeLiveModule'},

  // INVOICES
  {path: 'invoices', loadChildren: './invoices/invoices.module#InvoicesModule'},

  // SETTINGS
  {path: 'settings', loadChildren: './settings/settings.module#SettingsModule'},

  // OTHERS
  {path: 'privacy', component: PrivacyComponent},
  {path: 'email-verified/:token', loadChildren: './email-verified/email-verified.module#EmailVerifiedModule'},
  {path: 'reset-password/:token', loadChildren: './reset-password/reset-password.module#ResetPasswordModule'},
  {path: 'error', loadChildren: './errors/errors.module#ErrorsModule'},
  {path: 'premium', redirectTo: 'plans'}, // Fallback just in case some link wasn't change
  {path: 'plans', loadChildren: './premium/premium.module#PremiumModule'},

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
