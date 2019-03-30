import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.scss']
})
export class AdminStatisticsComponent implements OnInit {

  constructor(private titleService: Title) {

  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Statistics');
  }

}
