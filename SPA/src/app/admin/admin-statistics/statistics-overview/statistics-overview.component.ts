import {Component, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-statistics-overview',
    templateUrl: './statistics-overview.component.html',
    styleUrls: ['./statistics-overview.component.scss']
  })
  export class StatisticsOverviewComponent implements OnInit {

    constructor(private titleService: Title) {

    }

    ngOnInit(): void {
        this.titleService.setTitle('Kwee - Statistics');
    }
}
