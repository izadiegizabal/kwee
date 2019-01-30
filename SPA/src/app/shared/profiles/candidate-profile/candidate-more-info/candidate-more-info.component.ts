import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-candidate-more-info',
  templateUrl: './candidate-more-info.component.html',
  styleUrls: ['./candidate-more-info.component.scss']
})
export class CandidateMoreInfoComponent implements OnInit {
  @Input() candidate: any;

  constructor() {
  }

  ngOnInit() {
  }
}
