import {Component, OnInit} from '@angular/core';
import {LandingComponent} from './landing/landing.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLanding = false;

  constructor() {
  }

  ngOnInit() {
  }

  onActivate($event: any) {
    if ($event instanceof LandingComponent) {
      this.isLanding = true;
    }
  }

  onDeactivate($event: any) {
    if ($event instanceof LandingComponent) {
      this.isLanding = false;
    }
  }
}
