import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

// Angular Material modules
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

// Created Components
import { OfferPreviewCardComponent } from './offer/offer-preview-card/offer-preview-card.component';
import { OffererNameOverviewComponent } from './offerer/offerer-name-overview/offerer-name-overview.component';
import { IconWithTextComponent } from './common/icon-with-text/icon-with-text.component';

@NgModule({
  declarations: [
    AppComponent,
    OfferPreviewCardComponent,
    OffererNameOverviewComponent,
    IconWithTextComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    // Angular Material modules
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
