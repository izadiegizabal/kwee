import {Component, OnInit, ViewChild} from '@angular/core';
import {ObservableMedia} from '@angular/flex-layout';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @ViewChild('drawer') drawer: MatSidenav;

  constructor(public media: ObservableMedia) {
  }

  ngOnInit() {
  }

  closeDrawerIfMobile() {
    if (!this.media.isActive('gt-sm')) {
      this.drawer.toggle();
    }
  }
}
