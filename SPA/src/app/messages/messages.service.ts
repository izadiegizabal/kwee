import {Injectable} from '@angular/core';
import {WebsocketService} from '../sockets.io/websocket.service';
import * as MessageActions from './store/message.actions';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import {Message} from './store/message.reducers';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    public wsService: WebsocketService,
    private store$: Store<fromApp.AppState>
  ) {
    this.getMessage().subscribe((msg: Message) => {
      this.store$.dispatch(new MessageActions.AddMessage(msg));
    });
  }

  sendMessage(payload: any) {
    this.wsService.emit('message', payload);
  }

  getMessage() {
    return this.wsService.listen('new-msg');
  }

}
