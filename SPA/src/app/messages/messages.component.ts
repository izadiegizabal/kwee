import {Component, OnInit} from '@angular/core';
import {MessagesService} from '../services/messages.service';
import {first, take} from 'rxjs/operators';
import {WebsocketService} from '../services/websocket.service';
import { Observable, Subscription } from 'rxjs';
import * as MessageActions from './store/message.actions';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as fromMessages from './store/message.reducers';

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

export interface Message {
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  message: string;
  date: string;
  hour: string;
  total: number;
}

export interface Users {
  id: number;
  name: string;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {

  public messagesState: Observable<fromMessages.State>;

  conversation: any[] = [];
  subscription: Subscription;
  subscription2: Subscription;
  areConversations = false;
  userSelected = false;
  userList: Users[] = [];
  differentUsers: number;

  authState: any;
  token;
  authUser: any;
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
        this.authUser = user;
      });

    this.messageService.getMessage().subscribe(msg => {
      console.log(msg);
    });

    this.store$.dispatch(new MessageActions.TryGetMessages({}));

    this.messagesState = this.store$.pipe(select(state => state.messages));

    this.subscription = this.messagesState.pipe().subscribe(
      (message) => {
        if ( message.messages && message.messages.total > 0 ) {
          this.differentUsers = message.messages.total;
          this.userList = message.messages.data;
          this.areConversations = true;
        }
      });

  }

  selectUser( id ) {
    this.userSelected = true;
    this.store$.dispatch(new MessageActions.TryGetConversation({ id }));

    this.messagesState = this.store$.pipe(select(state => state.messages));

    this.subscription2 = this.messagesState.pipe().subscribe(
      (conver) => {
        if ( conver.messages && conver.messages.total > 0 ) {
          this.conversation = conver.messages.data;
          console.log('message: ', conver.messages.data);
        }
      });
  }

  send() {
    this.messageService.sendMessage(this.text);
    this.text = '';
  }

  getDate(dateFrom: any) {
    const date = new Date(dateFrom);
    return date.getDate() + '/' + ( date.getMonth() + 1 ) + '/' + date.getUTCFullYear();
  }

}
