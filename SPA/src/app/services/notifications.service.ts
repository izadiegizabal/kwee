import {EventEmitter, Injectable} from '@angular/core';
import {WebsocketService} from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  newNotification$: EventEmitter<any> = new EventEmitter<any>();
  notificationAlert$: EventEmitter<any> = new EventEmitter<any>();

  constructor(public wsService: WebsocketService) {
    this.getSelectedNotifications();
    this.getRateNotifications();
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
        // add to notification store
      }
    );
  }

  getRateNotifications() {
    this.wsService.listen('rating').subscribe((noti) => {
        console.log(noti);
        // add to notification store
      }
    );
  }
}
