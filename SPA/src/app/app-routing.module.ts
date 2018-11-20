import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OfferPreviewCardComponent} from './offer/offer-preview-card/offer-preview-card.component';
import {SmallcardComponent} from './smallcard/smallcard.component';
import {SignupComponent} from './auth/signup/signup.component';
import {SigninComponent} from './auth/signin/signin.component';

const routes: Routes = [
    {path: '', redirectTo: '/offerpreviewcard', pathMatch: 'full'},
    {path: 'offerpreviewcard', component: OfferPreviewCardComponent, pathMatch: 'full'},
    {path: 'smallcard', component: SmallcardComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'signin', component: SigninComponent},
    {path: '**', redirectTo: '/offerpreviewcard'}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
