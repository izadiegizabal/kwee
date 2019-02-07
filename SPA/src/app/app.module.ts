import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// Created Components
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {CoreModule} from './core/core.module';
import {CandidateHomeModule} from './candidate-home/candidate-home.module';
import {ActionReducer, MetaReducer, StoreModule} from '@ngrx/store';
import {reducers} from './store/app.reducers';
import {EffectsModule} from '@ngrx/effects';
import {environment} from '../environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {localStorageSync} from 'ngrx-store-localstorage';
import {OfferDetailModule} from './shared/offer-detail/offer-detail.module';
import {ChatModule} from './chat/chat.module';
import {CookieService} from 'ngx-cookie-service';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from 'ngx-cookieconsent';
import {PrivacyComponent} from './privacy/privacy.component';
import {OfferCreateComponent} from './shared/offer-create/offer-create.component';
import {OfferCreateModule} from './shared/offer-create/offer-create.module';
import { PaginatorModule } from './shared/paginator/paginator.module';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['auth', 'admin', 'offers', 'offer', 'profiles'], rehydrate: true})(reducer);
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

const cookieConfig: NgcCookieConsentConfig = {
  'cookie': {
    'domain': window.location.hostname
  },
  'position': 'bottom',
  'theme': 'edgeless',
  'palette': {
    'popup': {
      'background': '#000000',
      'text': '#ffffff',
      'link': '#ffffff'
    },
    'button': {
      'background': '#6fe8d3',
      'text': '#000000',
      'border': 'transparent'
    }
  },
  'type': 'info',
  'content': {
    'message': 'This site uses cookies. By continuing to browse the site, you are agreeing to our privacy policy and use of cookies.',
    'dismiss': 'Got it!',
    'deny': 'Refuse cookies',
    'link': 'Learn more',
    'href': '/privacy'
  }
};

@NgModule({
  declarations: [
    AppComponent,
    PrivacyComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    CandidateHomeModule,
    OfferDetailModule,
    OfferCreateModule,
    PaginatorModule,
    AppRoutingModule,
    FormsModule,
    ChatModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot([]),
    NgcCookieConsentModule.forRoot(cookieConfig),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
