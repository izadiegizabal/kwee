import { Component, OnInit, ViewChild } from '@angular/core';
import {MessagesService} from './messages.service';
import {WebsocketService} from '../sockets.io/websocket.service';
import {Observable} from 'rxjs';
import * as MessageActions from './store/message.actions';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as fromMessages from './store/message.reducers';
import * as moment from 'moment';
import {Title} from '@angular/platform-browser';

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
  public messagesState2: Observable<fromMessages.State>;

  sub;

  bdMessages: any[] = [];
  areMessages = false;
  userSelected = false;
  userList: Users[] = [];
  differentUsers: number;
  messageToSend: Message;

  authState: any;
  authUser: any;
  name: string;

  text = '';
  element: HTMLElement;

  showFiller = false;

  public data: any = [];

  @ViewChild('chat') chat;

  constructor(
    private titleService: Title,
    public messageService: MessagesService,
    public wsService: WebsocketService,
    private store$: Store<fromApp.AppState>
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Messages');

    this.authState = this.store$.pipe(select('auth'));
    this.authState.pipe(
      select((s: { user: string }) => s.user)
    ).subscribe(
      (user) => {
        this.authUser = user;
      });

    this.messageService.getMessage().subscribe(msg => {
      console.log('Mensaje recibido');
      console.log(msg);
      this.bdMessages.push(msg);


    });

    this.store$.dispatch(new MessageActions.TryGetMessages({}));

    this.sub = this.store$.pipe(select(state => state.messages)).subscribe(
      (message) => {
        if (message.messages && message.messages.total > 0) {

          this.differentUsers = message.messages.total;
          this.userList = message.messages.data;
          this.areMessages = true;

        }

      });


  }

  // lazyLoad angular 7
  // cdk-virtual-scroll

  // tslint:disable-next-line:use-life-cycle-interface
  selectUser(id) {
    this.sub.unsubscribe();
    this.userSelected = true;
    this.store$.dispatch(new MessageActions.TryGetConversation({id}));

    this.store$.pipe(select(state => state.messages)).subscribe(
      (conver) => {

        if (conver.messages && conver.messages.total > 0) {

          this.bdMessages = conver.messages.data;
          this.messageToSend = this.bdMessages[0];

          if (this.messageToSend.senderId !== this.authUser.id) {
            this.messageToSend.receiverId = this.messageToSend.senderId;
            this.messageToSend.receiverName = this.messageToSend.senderName;
            this.messageToSend.senderId = this.authUser.id;
            this.messageToSend.senderName = this.authUser.name;
          }
          this.initMessage();
          if (this.chat) {
            this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
          }
        }
      });

  }

  send() {
    if (this.text.trim().length === 0) {
      return;
    }
    this.messageToSend.message = this.text;
    this.messageToSend.date = moment().format('YYYY/MM/DD');
    this.messageToSend.hour = moment().format('HH:mm:ss');
    this.messageService.sendMessage(this.messageToSend);

    this.bdMessages.push(this.messageToSend);

    this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;

    const obj: any = this.messageToSend;

    this.store$.dispatch(new MessageActions.TryPostMessage(obj));
    this.initMessage();
    this.text = '';

  }

  initMessage() {
    this.messageToSend = JSON.parse(JSON.stringify(this.messageToSend));
  }
}
