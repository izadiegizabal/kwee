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
import {ActivatedRoute, Router} from '@angular/router';

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
  selectedUserId = -1;
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

  authUser: any;
  name: string;


  text = '';
  element: HTMLElement;

  showFiller = false;

  public data: any = [];

  @ViewChild('chat') chat;
  scrollPosition = 0;

  constructor(
    private titleService: Title,
    public messageService: MessagesService,
    public media: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store$: Store<fromApp.AppState>
  ) {
  }

  ngOnInit() {

    this.titleService.setTitle('Kwee - Messages');

    this.store$.pipe(select('auth')).pipe(
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

    this.store$.dispatch(new MessageActions.TryGetConvers({}));

    this.sub = this.store$.pipe(select(state => state.messages)).subscribe(
      (state) => {
        if (state.messages.chats && state.messages.chats.total > 0) {
          this.differentUsers = state.messages.chats.total;
          this.userList = state.messages.chats.data;
          this.areMessages = true;
          if (this.selectedUserId === -1 && this.userList && this.userList.length > 0) {
            this.selectUser(this.userList[0].id);
          }
        }
      });

    this.activatedRoute.params.subscribe((params) => {
      if (!isNaN(Number(params['id'])) && this.selectedUserId !== Number(params['id'])) {
        this.selectedUserId = Number(this.activatedRoute.params['id']);
        this.selectUser(Number(params['id']));

        // TODO: fetch who this is to update the user list and fix so that everything works
      }
    });
  }

  selectUser(id: number) {
    if (Number(this.activatedRoute.params['id']) !== this.selectedUserId) {
      this.router.navigate(['/messages', id]);
    }

    this.selectedUserId = id;
    this.closeDrawerIfMobile();

    this.isUserSelected = true;
    this.store$.dispatch(new MessageActions.TryGetConversation({id}));

    this.store$.pipe(select(state => state.messages)).subscribe(
      (state) => {
        if (state.messages.conver && state.messages.conver.total > 0) {
          this.bdMessages = state.messages.conver.data;

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
        }
      });

  }

  send(form: any) {

    this.text = form.text;

    if (this.text.trim().length === 0) {
      return;
    }
    this.messageToSend.receiverId = this.selectedUserId;
    this.messageToSend.message = this.text;
    this.messageToSend.date = moment().format('YYYY/MM/DD');
    this.messageToSend.hour = moment().format('HH:mm:ss');
    this.messageService.sendMessage(this.messageToSend);

    this.bdMessages.push(this.messageToSend);

    const obj: any = this.messageToSend;

    this.store$.dispatch(new MessageActions.TryPostMessage(obj));
    this.initMessage();
    this.text = '';

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
