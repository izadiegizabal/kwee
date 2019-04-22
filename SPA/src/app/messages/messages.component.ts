import { Component, OnInit, OnDestroy } from '@angular/core';
import {MessagesService} from '../services/messages.service';
import {first, take} from 'rxjs/operators';
import {WebsocketService} from '../services/websocket.service';
import { Observable, Subscription } from 'rxjs';
import * as MessageActions from './store/message.actions';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as fromMessages from './store/message.reducers';
import * as moment from 'moment';

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

  bdMessages: any[] = [];
  subscription: Subscription;
  subscription2: Subscription;
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
      console.log('Mensaje recibido');
      console.log(msg);
      this.bdMessages.push( msg );
      this.element = document.getElementById('chat-messages');
      if ( this.element ) {
        setTimeout( () => {
          this.element.scrollTop = this.element.scrollHeight;
        }, 50);
      }
    });

    this.store$.dispatch(new MessageActions.TryGetMessages({}));

    this.messagesState = this.store$.pipe(select(state => state.messages));

    this.subscription = this.messagesState.pipe().subscribe(
      (message) => {
        if ( message.messages && message.messages.total > 0 ) {
          this.differentUsers = message.messages.total;
          this.userList = message.messages.data;
          this.areMessages = true;
        }
        // console.log('userList: ', this.userList);
        // console.log('differentUsers: ', this.differentUsers);

      });


  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    if ( this.subscription ) {
      this.subscription.unsubscribe();
    }

    if ( this.subscription2 ) {
      this.subscription2.unsubscribe();
    }
  }

  selectUser( id ) {
    this.subscription.unsubscribe();
    this.userSelected = true;
    this.store$.dispatch(new MessageActions.TryGetConversation({ id }));

    this.messagesState2 = this.store$.pipe(select(state => state.messages));

    this.subscription2 = this.messagesState2.pipe().subscribe(
      (conver) => {

        if ( conver.messages && conver.messages.total > 0 ) {

          this.bdMessages = conver.messages.data;
          this.messageToSend = this.bdMessages[0];

          if ( this.messageToSend.senderId !== this.authUser.id ) {
            this.messageToSend.receiverId = this.messageToSend.senderId;
            this.messageToSend.receiverName = this.messageToSend.senderName;
            this.messageToSend.senderId = this.authUser.id;
            this.messageToSend.senderName = this.authUser.name;
          }

        }
      });
    this.subscription2.unsubscribe();
  }

  send( ) {
    if ( this.text.trim().length === 0 ) {
      return;
    }
    this.messageToSend.message = this.text;
    this.messageToSend.date =  moment().format('YYYY/MM/DD');
    this.messageToSend.hour = moment().format('HH:mm:ss');
    this.messageService.sendMessage(this.messageToSend);

    console.log('dbMessages antes push: ', this.bdMessages);
    console.log('messageToSend: ', this.messageToSend);
    this.bdMessages.push( this.messageToSend );
    console.log('dbMessages después push: ', this.bdMessages);

    this.element = document.getElementById('chat-messages');
    setTimeout( () => {
      this.element.scrollTop = this.element.scrollHeight;
    }, 50);

    const obj: any = this.messageToSend;

    this.store$.dispatch( new MessageActions.TryPostMessage( obj ));
    this.text = '';

  }

}
