import {NgModule} from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
// Angular Material modules
import {MatCardModule} from '@angular/material/card';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {SignupOffererComponent} from './auth/signup/signup-offerer/signup-offerer.component';
import {MatExpansionModule, MatNativeDateModule, MatSelectModule} from '@angular/material';
// Created Components
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {OfferPreviewCardComponent} from './offer/offer-preview-card/offer-preview-card.component';
import {OffererNameOverviewComponent} from './offerer/offerer-name-overview/offerer-name-overview.component';
import {IconWithTextComponent} from './common/icon-with-text/icon-with-text.component';
import {HeaderComponent} from './header/header.component';
import {SmallcardComponent} from './smallcard/smallcard.component';
import {FooterComponent} from './footer/footer.component';
import {SignupComponent} from './auth/signup/signup.component';
import {SignupCandidateComponent} from './auth/signup/signup-candidate/signup-candidate.component';
import {SignupinSectionComponent} from './header/signupin-section/signupin-section.component';
import {UserMenuComponent} from './header/user-menu/user-menu.component';
import {SigninComponent} from './auth/signin/signin.component';

@NgModule({
  declarations: [
    AppComponent,
    OfferPreviewCardComponent,
    OffererNameOverviewComponent,
    IconWithTextComponent,
    HeaderComponent,
    SmallcardComponent,
    FooterComponent,
    SignupComponent,
    SignupCandidateComponent,
    SignupOffererComponent,
    SignupinSectionComponent,
    UserMenuComponent,
    SigninComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,

    // Angular Material modules
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatExpansionModule,
    MatDividerModule
  ],
  providers: [MatIconRegistry],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    // material design icons
    matIconRegistry.addSvgIcon('date-range', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-date_range.svg'));
    matIconRegistry.addSvgIcon('work', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-work.svg'));
    matIconRegistry.addSvgIcon('local-atm', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-local_atm.svg'));
    matIconRegistry.addSvgIcon('search', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-search.svg'));
    matIconRegistry.addSvgIcon('filter-list', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-filter_list.svg'));
    matIconRegistry.addSvgIcon('place', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-place.svg'));
    matIconRegistry.addSvgIcon('access-time', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-access_time.svg'));
    matIconRegistry.addSvgIcon('person-add', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-person_add.svg'));
    matIconRegistry.addSvgIcon('person', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-person.svg'));
    matIconRegistry.addSvgIcon('people', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-people.svg'));
    matIconRegistry.addSvgIcon('account-circle', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-account_circle.svg'));
    matIconRegistry.addSvgIcon('share', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-share.svg'));
    matIconRegistry.addSvgIcon('arrow-drop-down', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-arrow_drop_down.svg'));
    matIconRegistry.addSvgIcon('chat', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-chat.svg'));
    matIconRegistry.addSvgIcon('notifications', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-notifications.svg'));
    matIconRegistry.addSvgIcon('settings', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-settings.svg'));
    matIconRegistry.addSvgIcon('timeline', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-timeline.svg'));
    matIconRegistry.addSvgIcon('domain', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-domain.svg'));
    matIconRegistry.addSvgIcon('email', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-email.svg'));
    matIconRegistry.addSvgIcon('lock', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-lock.svg'));
    matIconRegistry.addSvgIcon('visibility', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-visibility.svg'));
    matIconRegistry.addSvgIcon('visibility-off', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-visibility_off.svg'));
    matIconRegistry.addSvgIcon('public', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-public.svg'));
    matIconRegistry.addSvgIcon('cake', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-cake.svg'));

    // Branding icons
    matIconRegistry.addSvgIcon('kwee-logo', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/logo-kwee-light.svg'));
    matIconRegistry.addSvgIcon('kwee-logo-dark', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/logo-kwee-dark.svg'));
    matIconRegistry.addSvgIcon('kwee-icon', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/icon.svg'));
    matIconRegistry.addSvgIcon('kwee-icon-dark', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/iconBnw.svg'));
  }
}
