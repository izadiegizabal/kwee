import {Component, Input, OnInit} from '@angular/core';
import * as AuthActions from '../../../auth/store/auth.actions';
import * as fromApp from '../../../store/app.reducers';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as fromAuth from '../../../auth/store/auth.reducers';
import {getUrlfiedString, playNotificationSound} from '../../../shared/utils';
import * as fromMessages from '../../../messages/store/message.reducers';
import * as MessageActions from '../../../messages/store/message.actions';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  @Input() isLanding = false;

  authState: Observable<fromAuth.State>;
  notiState: Observable<fromMessages.State>;
  username = '';
  userId = '';
  userType = '';

  numNotifications = 0;
  numMessages = 0;
  message = false;

  constructor(private store$: Store<fromApp.AppState>,
              private router: Router) {
  }

  ngOnInit() {
    this.authState = this.store$.pipe(select('auth'));
    // Listen to changes on store
    this.authState.pipe(
      select(s => s.user)
    ).subscribe(
      (user) => {
        if (user && user.name && user.id) {
          this.username = user.name;
          this.userId = '' + user.id;
          this.userType = user.type;
          if (user.notifications > 0 && this.numNotifications !== user.notifications) {
            this.numNotifications = user.notifications;
            this.store$.dispatch(new MessageActions.SetNotificationUnreadCount(user.notifications));
          }
          if (user.messages > 0 && this.numMessages !== user.messages) {
            this.numMessages = user.messages;
            this.store$.dispatch(new MessageActions.SetMessageUnreadCount(user.messages));
          }
        }
      });

    // Listen to notification changes
    this.notiState = this.store$.pipe(select('messages'));
    this.notiState.subscribe(state => {
      if (state && state.notifications && state.messages) {
        // TODO: Show notification/messages overlay
        if (this.numNotifications !== state.notifications.unread) {
          if (this.numNotifications < state.notifications.unread) {
            playNotificationSound();
          }
          this.numNotifications = state.notifications.unread;
        }
        if (this.numMessages !== state.messages.unread) {
          if (this.numMessages < state.messages.unread) {
            if (this.router.url.split('\/')[1] !== 'chat') {
              playNotificationSound();
            }
          }
          this.numMessages = state.messages.unread;
        }
      }
    });
  }

  logOut() {
    this.store$.dispatch(new AuthActions.Logout());
  }

  urlfyUser() {
    return getUrlfiedString(this.username);
  }
}
