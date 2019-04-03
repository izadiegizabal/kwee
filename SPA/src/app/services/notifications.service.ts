import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  newNotification$: EventEmitter<any> = new EventEmitter<any>();
  notificationAlert$: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  newNotification(data?) {
    console.log('New Notification');
    this.newNotification$.emit(data);
  }

  notificationAlert(value?: boolean) {
    console.log('Notification Alert');
    this.notificationAlert$.emit(value);
  }

}
