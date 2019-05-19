import {EventEmitter, Injectable} from '@angular/core';
import {WebsocketService} from '../sockets.io/websocket.service';
import * as MessageActions from '../messages/store/message.actions';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  newNotification$: EventEmitter<any> = new EventEmitter<any>();
  notificationAlert$: EventEmitter<any> = new EventEmitter<any>();

  constructor(public wsService: WebsocketService,
              private store$: Store<fromApp.AppState>) {
    this.getSelectedNotifications();
    this.getRateNotifications();
    this.getAcceptedNotifications();
    this.getClosedNotifications();
  }

  newNotification(data?) {
    this.newNotification$.emit(data);
  }

  notificationAlert(value?: boolean) {
    this.notificationAlert$.emit(value);
  }

  getSelectedNotifications() {
    this.wsService.listen('selected').subscribe((noti) => {
        console.log(noti);
        this.store$.dispatch(new MessageActions.AddNotification(undefined));
      }
    );
  }

  getRateNotifications() {
    this.wsService.listen('rating').subscribe((noti) => {
        console.log(noti);
        this.store$.dispatch(new MessageActions.AddNotification(undefined));
      }
    );
  }

  getAcceptedNotifications() {
    this.wsService.listen('accepted').subscribe((noti) => {
        console.log(noti);
        this.store$.dispatch(new MessageActions.AddNotification(undefined));
      }
    );
  }

  getClosedNotifications() {
    this.wsService.listen('closed').subscribe((noti) => {
        console.log(noti);
        this.store$.dispatch(new MessageActions.AddNotification(undefined));
      }
    );
  }
}
