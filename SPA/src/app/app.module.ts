import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// Created Components
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {OfferPreviewCardComponent} from './offer/offer-preview-card/offer-preview-card.component';
import {SmallcardComponent} from './smallcard/smallcard.component';
import {SigninComponent} from './auth/signin/signin.component';
import {SearchbarComponent} from './shared/searchbar/searchbar.component';
import {CandidateHomeComponent} from './candidate-home/candidate-home.component';
import {SharedModule} from './shared/shared.module';
import {CoreModule} from './core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    OfferPreviewCardComponent,
    SmallcardComponent,
    SigninComponent,
    SearchbarComponent,
    CandidateHomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
