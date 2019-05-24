import {Component, OnInit, ViewChild} from '@angular/core';
import {MessagesService} from './messages.service';
import * as MessageActions from './store/message.actions';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as fromMessages from './store/message.reducers';
import {Chat, Message} from './store/message.reducers';
import * as moment from 'moment';
import {Title} from '@angular/platform-browser';
import {MatSidenav} from '@angular/material';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {

  @ViewChild('drawer') drawer: MatSidenav;

  apiUrl = environment.apiUrl;

  lastDate = new Date();
  areMessages = false;
  isUserSelected = false;
  selectedUserId = -1;
  selectedUser: Chat;
  differentUsers: number;
  messageToSend: Message = {
    __v: 0,
    _id: '',
    date: '',
    hour: '',
    message: '',
    receiverId: 0,
    receiverName: '',
    senderId: 0
  };

  authUser: any;
  name: string;


  text = '';
  element: HTMLElement;

  public data: any = [];

  @ViewChild('chat') chat;
  private messagesState: Observable<fromMessages.State>;

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
        if (user && this.authUser !== user) {
          this.authUser = user;
          this.messageToSend.senderId = this.authUser.id;
        }
      });

    this.messageService.getMessage().subscribe(msg => {
      // TODO: dispatch to store
      this.scrollBottom();
    });

    this.store$.dispatch(new MessageActions.TryGetConvers());

    this.store$.pipe(select(state => state.messages)).subscribe(
      (state) => {
        if (state.messages.chats && state.messages.chats.total > 0) {
          this.differentUsers = state.messages.chats.total;

          this.addCurrentUser();

          this.areMessages = true;
          if (this.selectedUserId === -1
            && state.messages.chats.data
            && state.messages.chats.data[0]
            && state.messages.chats.data.length > 0) {
            this.selectUser(state.messages.chats.data[0].id);
            // TODO: add loader
            setTimeout(() => {
              this.scrollBottom();
            }, 3000);
          }
        }
      });

    this.activatedRoute.params.subscribe((params) => {
      if (!isNaN(Number(params['id'])) && this.selectedUserId !== Number(params['id'])) {
        const newId = Number(params['id']);
        // TODO: empty current chat?
        this.selectedUserId = newId;

        this.selectUser(newId);
        // TODO: fetch who this is to update the user list and fix so that everything works
      }
    });
  }

  selectUser(id: number) {
    if (Number(this.activatedRoute.params['id']) !== this.selectedUserId) {
      this.router.navigate(['/messages', id]);
    }

    this.selectedUserId = id;
    this.selectedUser = this.findUser(id);
    this.isUserSelected = true;
    this.closeDrawerIfMobile();

    this.store$.dispatch(new MessageActions.TryGetConversation(id));

    this.messagesState = this.store$.pipe(select('messages'));
    this.messagesState.subscribe(
      (state) => {
        if (state.messages.conver && state.messages.conver.total > 0) {

          if (state.messages.conver.data[0]) {
            this.messageToSend = state.messages.conver.data[0];
          }

          if (this.messageToSend.senderId !== this.authUser.id) {
            this.messageToSend.receiverId = this.messageToSend.senderId;
            this.messageToSend.senderId = this.authUser.id;
          }

          this.initMessage();
        }
        this.scrollBottom();
      });
    this.scrollBottom();
  }

  private findUser(id: number): Chat {


    return undefined;
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

    const obj: any = this.messageToSend;

    this.store$.dispatch(new MessageActions.TryPostMessage(obj));
    this.initMessage();
    this.text = '';

    this.scrollBottom();
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

  private scrollBottom() {
    if (this.chat) {
      setTimeout(() => {
        if (this.chat) {
          this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
        }
      }, 5);
    }
  }

  isNewDay(date: string) {
    const currentDate = new Date(date);

    if (this.lastDate === currentDate) {
      const isSameDay = this.lastDate.getFullYear() === currentDate.getFullYear()
        && this.lastDate.getMonth() === currentDate.getMonth()
        && this.lastDate.getDate() === currentDate.getDate();
      this.lastDate = currentDate;
      return !isSameDay;
    } else {
      return false;
    }
  }

  getDate(date: string) {
    return new Date(date);
  }

  private addCurrentUser() {
    // TODO: check if exists, otherwise create
    const checkId = Number(this.activatedRoute.params['id']);
    if (this.findUser(checkId)) {

    }
  }

  getFormattedListDate(date: string, hour: string) {
    const dateDate = new Date(date);

    if (this.isNewDay(date)) {
      return dateDate.getDate() + '/' + (dateDate.getMonth() + 1) + '/' + (dateDate.getFullYear() + '').substr(2, 2);
    } else {
      return hour.substr(0, 5);
    }
  }
}
