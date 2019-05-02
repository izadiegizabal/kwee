import {Component, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-candidate-settings',
  templateUrl: './candidate-settings.component.html',
  styleUrls: ['./candidate-settings.component.scss', '../business-settings/business-settings.component.scss']
})
export class CandidateSettingsComponent implements OnInit {
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
