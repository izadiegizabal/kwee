import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent implements OnInit {

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Reports');
  }

}
