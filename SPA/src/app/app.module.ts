import {NgModule} from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {SignupOffererComponent} from './auth/signup/signup-offerer/signup-offerer.component';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatChipsModule,
  MatExpansionModule,
  MatListModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule
} from '@angular/material';
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
import {AdminComponent} from './admin/admin.component';
import {AdminStatisticsComponent} from './admin/admin-statistics/admin-statistics.component';
import {AdminManageCandidatesComponent} from './admin/admin-manage-candidates/admin-manage-candidates.component';
import {AdminManageBusinessesComponent} from './admin/admin-manage-businesses/admin-manage-businesses.component';
import {AdminVerifyComponent} from './admin/admin-verify/admin-verify.component';
import {AdminReportsComponent} from './admin/admin-reports/admin-reports.component';
import {AdminMessagesComponent} from './admin/admin-messages/admin-messages.component';
import {CandidateOverviewComponent} from './admin/admin-manage-candidates/candidate-overview/candidate-overview.component';
import {BusinessOverviewComponent} from './admin/admin-manage-businesses/business-overview/business-overview.component';
import {SearchbarComponent} from './common/searchbar/searchbar.component';
import {CandidateHomeComponent} from './candidate-home/candidate-home.component';

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
    AdminComponent,
    AdminStatisticsComponent,
    AdminManageCandidatesComponent,
    AdminManageBusinessesComponent,
    AdminVerifyComponent,
    AdminReportsComponent,
    AdminMessagesComponent,
    CandidateOverviewComponent,
    BusinessOverviewComponent,
    SearchbarComponent,
    CandidateHomeComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    // Angular Material modules
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    MatCheckboxModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatExpansionModule,
    MatDividerModule,
    MatSidenavModule,
    MatRadioModule,
    MatListModule,
    MatBadgeModule,
    MatChipsModule,
    MatAutocompleteModule
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
    matIconRegistry.addSvgIcon('check-circle', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-check_circle.svg'));
    matIconRegistry.addSvgIcon('report', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-report.svg'));

    // Branding icons
    matIconRegistry.addSvgIcon('kwee-logo', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/logo-kwee-light.svg'));
    matIconRegistry.addSvgIcon('kwee-logo-dark', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/logo-kwee-dark.svg'));
    matIconRegistry.addSvgIcon('kwee-icon', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/icon.svg'));
    matIconRegistry.addSvgIcon('kwee-icon-dark', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/iconBnw.svg'));
  }
}
