import {Component, OnInit} from '@angular/core';
import {LandingComponent} from './landing/landing.component';
import {RouterOutlet} from '@angular/router';
import {slider} from './route-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ // <-- add animations that are used here
    slider,
  ]
})
export class AppComponent implements OnInit {
  footerHidden = false;

  isLanding = false;

  constructor() {
  }

  ngOnInit() {
  }

  onActivate($event: any) {
    this.hideFooterDuringTransition(450);
    if ($event instanceof LandingComponent) {
      this.isLanding = true;
    }
  }

  onDeactivate($event: any) {
    this.hideFooterDuringTransition(400);
    if ($event instanceof LandingComponent) {
      this.isLanding = false;
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  private hideFooterDuringTransition(duration: number) {
    this.footerHidden = true;
    setTimeout(() => {
      this.footerHidden = false;
    }, duration);
  }
}
