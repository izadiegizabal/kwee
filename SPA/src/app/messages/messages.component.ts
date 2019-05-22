import {Component, OnInit, ViewChild} from '@angular/core';
import {MessagesService} from './messages.service';
import {Observable} from 'rxjs';
import * as MessageActions from './store/message.actions';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as fromMessages from './store/message.reducers';
import * as moment from 'moment';
import {Title} from '@angular/platform-browser';
import {MatSidenav} from '@angular/material';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ActivatedRoute} from '@angular/router';

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

  @ViewChild('drawer') drawer: MatSidenav;

  sub;

  bdMessages: any[] = [];
  areMessages = false;
  isUserSelected = false;
  userList: Users[] = [];
  differentUsers: number;
  messageToSend = {
    date: '',
    hour: '',
    message: '',
    receiverId: 0,
    receiverName: '',
    senderId: 0,
    senderName: '',
    total: 0
  };

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
    public media: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
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

    this.activatedRoute.params.subscribe((params) => {
      if (!isNaN(Number(params['id']))) {
        this.selectUser(Number(params['id']));

        // TODO: fetch who this is to update the user list and fix so that everything works
      }
    });
  }

  selectUser(id: number) {

    console.log('trying to get conversation from id: ' + id);
    // TODO: Update param id

    this.closeDrawerIfMobile();

    this.sub.unsubscribe();
    this.isUserSelected = true;
    this.store$.dispatch(new MessageActions.TryGetConversation({id}));

    this.store$.pipe(select(state => state.messages)).subscribe(
      (conver) => {

        if (conver.messages && conver.messages.total > 0) {

          this.bdMessages = conver.messages.data;

          if (this.bdMessages[0]) {
            this.messageToSend = this.bdMessages[0];
          }

          if (this.messageToSend.senderId !== this.authUser.id) {
            this.messageToSend.receiverId = this.messageToSend.senderId;
            this.messageToSend.receiverName = this.messageToSend.senderName;
            this.messageToSend.senderId = this.authUser.id;
            this.messageToSend.senderName = this.authUser.name;
          }
          this.initMessage();
          this.scrollChat();
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

    this.scrollChat();

    const obj: any = this.messageToSend;

    this.store$.dispatch(new MessageActions.TryPostMessage(obj));
    this.initMessage();
    this.text = '';

  }

  private scrollChat() {
    if (this.chat) {
      this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
    }
  }

  initMessage() {
    this.messageToSend = JSON.parse(JSON.stringify(this.messageToSend));
  }

  isMobile() {
    return !this.media.isMatched('screen and (min-width: 599px)'); // gt-sm
  }

  closeDrawerIfMobile() {
    if (this.isMobile()) {
      this.drawer.toggle();
    }
  }
}
