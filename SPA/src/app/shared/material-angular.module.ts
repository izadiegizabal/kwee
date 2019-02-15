import {NgModule} from '@angular/core';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTabsModule,
  MatToolbarModule,
  MatPaginatorModule,
} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
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
    MatAutocompleteModule,
    MatDialogModule,
    MatPaginatorModule,
    MatMenuModule,
  ],
  exports: [
    CommonModule,
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
    MatAutocompleteModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatMenuModule,
  ],
})
export class MaterialAngularModule {
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
    matIconRegistry.addSvgIcon('alarm', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-alarm.svg'));
    matIconRegistry.addSvgIcon('face', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-face.svg'));
    matIconRegistry.addSvgIcon(
      'insert-drive-file', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-insert_drive_file.svg'));
    matIconRegistry.addSvgIcon('thumb-up', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-thumb_up.svg'));
    matIconRegistry.addSvgIcon('thumb-down', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-thumb_down.svg'));
    matIconRegistry.addSvgIcon('close', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-close.svg'));
    matIconRegistry.addSvgIcon('money', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-money.svg'));
    matIconRegistry.addSvgIcon('attach-money', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-attach_money.svg'));
    matIconRegistry.addSvgIcon('error', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-error.svg'));
    matIconRegistry.addSvgIcon('favorite', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-favorite.svg'));
    matIconRegistry.addSvgIcon('drafts', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-drafts.svg'));
    matIconRegistry.addSvgIcon('inbox', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-inbox.svg'));
    matIconRegistry.addSvgIcon('move-to-inbox', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-move_to_inbox.svg'));
    matIconRegistry.addSvgIcon('mail', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-mail.svg'));
    matIconRegistry.addSvgIcon('archive', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-archive.svg'));

    // Branding icons
    matIconRegistry.addSvgIcon('kwee-logo', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/logo-kwee-light.svg'));
    matIconRegistry.addSvgIcon('kwee-logo-dark', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/logo-kwee-dark.svg'));
    matIconRegistry.addSvgIcon('kwee-icon', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/icon.svg'));
    matIconRegistry.addSvgIcon('kwee-icon-dark', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/iconBnw.svg'));
  }
}
