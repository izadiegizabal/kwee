import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-admin-manage-offers',
  templateUrl: './admin-manage-offers.component.html',
  styleUrls: ['./admin-manage-offers.component.scss']
})
export class AdminManageOffersComponent implements OnInit {

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Manage Offers');
  }

}
