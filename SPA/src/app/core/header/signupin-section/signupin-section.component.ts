import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-signupin-section',
  templateUrl: './signupin-section.component.html',
  styleUrls: ['./signupin-section.component.scss']
})
export class SignupinSectionComponent implements OnInit {
  @Input() isLanding = false;

  constructor() {
  }

  ngOnInit() {
  }

}
