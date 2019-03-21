import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-admin-manage-businesses',
  templateUrl: './admin-manage-businesses.component.html',
  styleUrls: ['./admin-manage-businesses.component.scss']
})
export class AdminManageBusinessesComponent implements OnInit {

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Manage Businesses');
  }

}
