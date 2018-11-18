import {Component} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public constructor(
    private domSanitizer: DomSanitizer,
    public matIconRegistry: MatIconRegistry) {
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

    // Branding icons
    matIconRegistry.addSvgIcon('kwee-logo-light', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/logo-kwee-light.svg'));
    matIconRegistry.addSvgIcon('kwee-icon-light', domSanitizer.bypassSecurityTrustResourceUrl('assets/branding/icon.svg'));
  }
}
