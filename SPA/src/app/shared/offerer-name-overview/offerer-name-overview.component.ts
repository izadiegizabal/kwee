import {Component, Input, OnInit} from '@angular/core';
import {getColourFromIndex} from '../utils.service';

@Component({
  selector: 'app-offerer-name-overview',
  templateUrl: './offerer-name-overview.component.html',
  styleUrls: ['./offerer-name-overview.component.scss']
})
export class OffererNameOverviewComponent implements OnInit {
  @Input() index: number;
  @Input() name: string;
  @Input() size: string;

  constructor() {
  }

  ngOnInit() {
  }

  private getBGColour() {
    // return getColourFromIndex(this.index);
  }

}
