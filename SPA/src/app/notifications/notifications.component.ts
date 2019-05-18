import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import {Observable} from 'rxjs';
import * as fromMessages from '../messages/store/message.reducers';
import * as MessageAcctions from '../messages/store/message.actions';
import {Title} from '@angular/platform-browser';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  count = 0;
  notifications: any;

  notiState: Observable<fromMessages.State>;

  // Paginator
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pageEvent: PageEvent;

  constructor(private store$: Store<fromApp.AppState>,
              private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Notifications');

    this.notiState = this.store$.pipe(select('messages'));
    this.notiState.subscribe(state => {
      if (state && state.notifications && this.notifications !== state.notifications) {
        this.count = state.notifications.total;
        this.notifications = state.notifications.data;
      }
    });
    this.store$.dispatch(new MessageAcctions.TryGetNotifications({page: 1, limit: this.pageSize}));
  }

  changepage() {
    this.store$.dispatch(new MessageAcctions.TryGetNotifications(
      {page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize}));
  }

}
