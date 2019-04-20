import {Component, OnInit} from '@angular/core';
import {MessagesService} from '../services/messages.service';
import {select, Store} from '@ngrx/store';
import {first, take} from 'rxjs/operators';
import * as fromApp from '../store/app.reducers';
import {WebsocketService} from '../services/websocket.service';
import { Observable, Subscription } from 'rxjs';
import * as fromMessages from './store/message.reducers';
import * as MessageActions from './store/message.actions';

export interface Users {
  id: number;
  name: string;
  type: string;
  email: string;
}

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

interface Message {
  senderName: string;
  receiverName: string;
  message: string;
  createdAt: Date;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {

  public messagesState: Observable<fromMessages.State>;

  messages: Message[] = [];
  subscription: Subscription;
  noMessages: boolean;

  authState: any;
  token;
  users: any = [];
  name: string;

  text = '';
  showFiller = false;

  public data: any = [];

  tiles: Tile[] = [
    {text: 'Users', cols: 1, rows: 2, color: 'lightblue'},
    {text: 'Chat', cols: 3, rows: 2, color: 'lightgray'},
  ];

  constructor(
    public messageService: MessagesService,
    public wsService: WebsocketService,
    private store$: Store<fromApp.AppState>
  ) {
  }

  ngOnInit() {
    this.authState = this.store$.pipe(select('auth'));
    this.authState.pipe(
      select((s: { user: string }) => s.user)
    ).subscribe(
      (user) => {
        this.users.push(user);
      });

    console.log(this.users);

    this.messageService.getMessage().subscribe(msg => {
      console.log(msg);
    });

    this.store$.dispatch(new MessageActions.TryGetMessages({
      id: this.name,
    }));

    this.messagesState = this.store$.pipe(select(state => state.messages));

    this.subscription = this.messagesState.pipe(take(1)).subscribe(
      (message) => {
        console.log('message: ', message);
        if ( message.messages && message.messages.data.length > 0) {
        console.log(message.messages.data);
          // if ((this.business && message.messages.data[0].offerer) || (this.candidate && message.messages.data[0].applicant)) {
          //   message.messages.data.forEach(e => {
          //       this.address = this.business && e.offerer ? e.offerer.address : '';
          //       const inv = e.message;
          //       this.messages.push({id: inv.id, date: this.getDate(inv.createdAt), total: inv.price, product: inv.product});
          //   });
          // }
        } else {
          this.noMessages = true;
        }
      });

  }

  send() {
    this.messageService.sendMessage(this.text);
    this.text = '';
  }

}
