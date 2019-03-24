import {Component, OnInit, EventEmitter, Input} from '@angular/core';
import * as AuthActions from '../../../auth/store/auth.actions';
import * as fromApp from '../../../store/app.reducers';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as fromAuth from '../../../auth/store/auth.reducers';
import {getUrlfiedString} from '../../../shared/utils.service';
import { MessagesService } from '../../../services/messages.service';
import { WebsocketService } from '../../../services/websocket.service';
import { NotificationsService } from '../../../services/notifications.service';
import { _countGroupLabelsBeforeOption } from '@angular/material';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  @Input() isLanding = false;

  authState: Observable<fromAuth.State>;
  username = '';
  userId = '';
  userType = '';

  numNotifications = 0;
  numMessages = 0;
  notification = false;
  message = false;

  constructor(private store$: Store<fromApp.AppState>,
    public wsService: WebsocketService,
    public messageService: MessagesService,
    public notificationsService: NotificationsService) {
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
        }
      });
    this.messageService.getSelected().subscribe( msg => {
      this.numNotifications++;
      this.notification = true;
    });
    this.notificationsService.newNotification$.subscribe((data) => {
      if ( data > 0 ) {
        this.notification = true;
      }
      this.numNotifications = data;
    });
    this.notificationsService.notificationAlert$.subscribe((value) => {
      this.notification = value;
    });
  }

  logOut() {
    this.store$.dispatch(new AuthActions.Logout());
  }

  urlfyUser() {
    return getUrlfiedString(this.username);
  }
}
