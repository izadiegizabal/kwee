import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-offerer-name-overview',
  templateUrl: './offerer-name-overview.component.html',
  styleUrls: ['./offerer-name-overview.component.scss']
})
export class OffererNameOverviewComponent implements OnInit {
  @Input() index: number;
  @Input() name: string;
  @Input() size: string;

  @Input() businessIndexBreakdown;
  @Input() candidateIndexBreakdown;

  renderBreakdown = false;

  shownBreakdown = false;

  pb1Value = 0;
  pb2Value = 0;
  pb3Value = 0;
  pb4Value = 0;
  pb5Value = 0;

  constructor() {
  }

  ngOnInit() {
    this.renderBreakdown = !!(this.candidateIndexBreakdown || this.businessIndexBreakdown);
  }

  showBreakdown(show: boolean) {
    if (show) {
      this.shownBreakdown = true;
      setTimeout(() => this.pb1Value = this.getProgressBarValue(1), 10);
      setTimeout(() => this.pb2Value = this.getProgressBarValue(2), 20);
      setTimeout(() => this.pb3Value = this.getProgressBarValue(3), 30);
      setTimeout(() => this.pb4Value = this.getProgressBarValue(4), 40);
      setTimeout(() => this.pb5Value = this.getProgressBarValue(5), 50);
    } else {
      this.shownBreakdown = false;
      this.pb1Value = 0;
      this.pb2Value = 0;
      this.pb3Value = 0;
      this.pb4Value = 0;
      this.pb5Value = 0;
    }
  }

  getProgressBarValue(avgNum: number) {
    let outOfFive = 0;
    if (this.businessIndexBreakdown) {
      outOfFive = this.businessIndexBreakdown[Object.keys(this.businessIndexBreakdown)[avgNum - 1]];
    } else if (this.candidateIndexBreakdown) {
      outOfFive = this.candidateIndexBreakdown[Object.keys(this.candidateIndexBreakdown)[avgNum - 1]];
    }

    return (outOfFive * 100) / 5; // convert from max 5 to max 100
  }

  getBGColour() {
    // return getColourFromIndex(this.index);
  }

}
