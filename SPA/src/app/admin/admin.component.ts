import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @ViewChild('drawer') drawer: MatSidenav;

  constructor(public media: BreakpointObserver) {
  }

  ngOnInit() {
  }

  isMobile() {
    return !this.media.isMatched('screen and (min-width: 960px)'); // gt-sm
  }

  closeDrawerIfMobile() {
    if (this.isMobile()) {
      this.drawer.toggle();
    }
  }
}
