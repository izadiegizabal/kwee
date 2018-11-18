import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FlexLayoutModule} from '@angular/flex-layout';
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
import { HeaderComponent } from './header/header.component';
import {MatMenuModule, MatToolbarModule} from '@angular/material';
import { SmallcardComponent } from './smallcard/smallcard.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    OfferPreviewCardComponent,
    OffererNameOverviewComponent,
    IconWithTextComponent,
    HeaderComponent,
    SmallcardComponent,
    FooterComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,

    // Angular Material modules
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
