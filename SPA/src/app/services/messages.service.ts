import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    public wsService: WebsocketService
  ) { }

  sendMessage( msg: string ) {

    const payload = {
      from: 'Carlos',
      body: msg
    };

    this.wsService.emit('message', payload);

  }

  getMessage() {
    return this.wsService.listen('new-msg');
  }

  getSelected() {
    return this.wsService.listen('selected');
  }

}
