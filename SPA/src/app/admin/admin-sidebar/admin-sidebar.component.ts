import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ObservableMedia} from '@angular/flex-layout';
import {MatSidenav} from '@angular/material';


@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {

  constructor(public media: ObservableMedia) {
  }

  ngOnInit() {
  }
}
