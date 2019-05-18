import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import {Observable} from 'rxjs';
import * as fromMessages from '../messages/store/message.reducers';
import * as MessageActions from '../messages/store/message.actions';
import {Title} from '@angular/platform-browser';
import {PageEvent} from '@angular/material';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as fromAuth from '../auth/store/auth.reducers';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  count = 0;
  notifications: any;

  notiState: Observable<fromMessages.State>;
  authState: Observable<fromAuth.State>;
  token: string;

  // Paginator
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pageEvent: PageEvent;

  constructor(private store$: Store<fromApp.AppState>,
              private httpClient: HttpClient,
              private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Notifications');

    this.notiState = this.store$.pipe(select('messages'));
    this.notiState.subscribe(state => {
      if (state && state.notifications && this.notifications !== state.notifications) {
        this.count = state.notifications.total;
        this.notifications = state.notifications.data;
        if (state.notifications.unread !== 0) {
          this.markNotisAsRead();
        }
      }
    });
    this.store$.dispatch(new MessageActions.TryGetNotifications({page: 1, limit: this.pageSize}));

    this.authState = this.store$.pipe(select('auth'));
    this.authState.pipe(
      select((s: { token: string }) => s.token)
    ).subscribe(
      (token) => {
        this.token = token;
        this.markNotisAsRead();
      });
  }

  private markNotisAsRead() {
    if (this.notifications) {
      for (const noti of this.notifications) {
        if (!noti.read) {
          this.markNotiRead(noti.id);
        }
      }
      this.store$.dispatch(new MessageActions.SetNotificationUnreadCount(0));
    }
  }

  private markNotiRead(id: number) {
    if (this.token) {
      const apiEndpointUrl = environment.apiUrl + 'notification/' + id + '/read';
      const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', this.token);

      this.httpClient.put(apiEndpointUrl, '', {headers: headers}).pipe(
        map((res) => {
          console.log('it worked');
          console.log(res);
        })
      );
    }
  }

  changepage() {
    this.store$.dispatch(new MessageActions.TryGetNotifications(
      {page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize}));
  }

}
