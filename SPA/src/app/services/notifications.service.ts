import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  newNotification$: EventEmitter<any> = new EventEmitter<any>();
  notificationAlert$: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  newNotification(data?) {
    this.newNotification$.emit(data);
  }

  notificationAlert(value?: boolean) {
    this.notificationAlert$.emit(value);
  }

}
