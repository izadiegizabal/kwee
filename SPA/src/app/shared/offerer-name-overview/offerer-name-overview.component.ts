import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-offerer-name-overview',
  templateUrl: './offerer-name-overview.component.html',
  styleUrls: ['./offerer-name-overview.component.scss']
})
export class OffererNameOverviewComponent implements OnInit {
  @Input() index: number;
  @Input() name: string;

  constructor() {
  }

  ngOnInit() {
  }

}
