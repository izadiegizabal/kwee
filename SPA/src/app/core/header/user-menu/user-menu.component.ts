import {Component, Input, OnInit} from '@angular/core';
import * as AuthActions from '../../../auth/store/auth.actions';
import * as fromApp from '../../../store/app.reducers';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as fromAuth from '../../../auth/store/auth.reducers';
import {getUrlfiedString} from '../../../shared/utils.service';
import {MessagesService} from '../../../services/messages.service';
import * as fromMessages from '../../../messages/store/message.reducers';

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
              public messageService: MessagesService) {
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
          if (user.notifications > 0) {
            this.numNotifications = user.notifications;
          }
        }
      });

    // Listen to notification changes
    this.notiState = this.store$.pipe(select('messages'));
    this.notiState.subscribe(state => {
      if (state && state.notifications) {
        if (this.numNotifications !== state.notifications.unread) {
          this.numNotifications = state.notifications.unread;

          // TODO: Show notification overlay
        }
      }
    });

    this.messageService.getSelected().subscribe(msg => {
      this.numMessages++;
    });
  }

  logOut() {
    this.store$.dispatch(new AuthActions.Logout());
  }

  urlfyUser() {
    return getUrlfiedString(this.username);
  }

  getNotificationNum() {
    return this.numNotifications;
  }
}
