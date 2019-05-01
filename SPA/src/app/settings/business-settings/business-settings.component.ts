import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-business-settings',
  templateUrl: './business-settings.component.html',
  styleUrls: ['./business-settings.component.scss']
})
export class BusinessSettingsComponent implements OnInit {
  @ViewChild('drawer') drawer: MatSidenav;

  constructor(public media: BreakpointObserver) {
  }

  ngOnInit() {
  }

  isMobile() {
    return !this.media.isMatched('screen and (min-width: 599px)'); // gt-sm
  }

  closeDrawerIfMobile() {
    if (this.isMobile()) {
      this.drawer.toggle();
    }
  }

}
