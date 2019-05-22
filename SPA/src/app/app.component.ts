import {Component, OnInit} from '@angular/core';
import {LandingComponent} from './landing/landing.component';
import {NavigationEnd, Router} from '@angular/router';
import { NotificationsService } from './notifications/notifications.service';
import { MessagesService } from './messages/messages.service';

// Google Analytics
declare let ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  footerHidden = false;

  isLanding = false;

  constructor(public router: Router,
              public notifications: NotificationsService,
              public messages: MessagesService) {

    // Subscribe to router events and send page views to Google Analytics
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
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
