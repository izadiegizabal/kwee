import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import {NotificationsService} from '../services/notifications.service';
import {Observable} from 'rxjs';
import * as fromMessages from '../messages/store/message.reducers';
import * as MessageAcctions from '../messages/store/message.actions';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  count = 0;

  notiState: Observable<fromMessages.State>;

  constructor(
    private store$: Store<fromApp.AppState>,
    private titleService: Title,
    public notificationsService: NotificationsService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Notifications');

    this.notiState = this.store$.pipe(select('messages'));
    this.notiState.subscribe(state => {
      if (state && state.notifications) {
        this.count = state.notifications.total;
      }
    });
    this.store$.dispatch(new MessageAcctions.TryGetNotifications({page: 1, limit: 10}));
    // this.notificationsService.newNotification(0);
    // this.notificationsService.notificationAlert(false);
  }

}
