import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-past-positions',
  templateUrl: './past-positions.component.html',
  styleUrls: ['./past-positions.component.scss']
})
export class PastPositionsComponent implements OnInit {

  @Input() applications: any;

  constructor() {
  }

  ngOnInit() {
  }

}
