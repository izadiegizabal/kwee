import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import { MessagesService } from '../services/messages.service';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  count = 0;

  constructor(
    public wsService: WebsocketService,
    public messageService: MessagesService,
    private store$: Store<fromApp.AppState>,
    public notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.notificationsService.newNotification(0);
    this.notificationsService.notificationAlert(false);
  }

}
