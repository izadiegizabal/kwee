import {Component} from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'My First Angular App';

  public constructor(
    private domSanitizer: DomSanitizer,
    public matIconRegistry: MatIconRegistry) {
    // add custom material icons
    matIconRegistry.addSvgIcon('date-range', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-date_range.svg'));
    matIconRegistry.addSvgIcon('work-type', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-work.svg'));
    matIconRegistry.addSvgIcon('wage', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-local_atm.svg'));
    matIconRegistry.addSvgIcon('search', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-search.svg'));
    matIconRegistry.addSvgIcon('filter', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-filter_list.svg'));
    matIconRegistry.addSvgIcon('place', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-place.svg'));
    matIconRegistry.addSvgIcon('time', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-access_time.svg'));
    matIconRegistry.addSvgIcon('person-add', domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/twotone-person_add.svg'));
  }
}
