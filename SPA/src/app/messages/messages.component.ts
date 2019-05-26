import {Component, OnInit, ViewChild} from '@angular/core';
import {MessagesService} from './messages.service';
import * as MessageActions from './store/message.actions';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as fromMessages from './store/message.reducers';
import {Chat, getActiveChatById, Message} from './store/message.reducers';
import * as moment from 'moment';
import {Title} from '@angular/platform-browser';
import {MatSidenav} from '@angular/material';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {playNotificationSound} from '../shared/utils';
import {filter} from 'rxjs/operators';
import {MessageEffects} from './store/message.effects';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {

  @ViewChild('drawer') drawer: MatSidenav;

  apiUrl = environment.apiUrl;

  lastDate = new Date();
  isUserSelected = false;
  selectedUserId = -1;
  selectedUser: Chat;
  messageToSend: Message = {
    __v: 0,
    _id: '',
    date: '',
    hour: '',
    message: '',
    receiverId: 0,
    receiverName: '',
    senderId: 0,
    senderName: '',
    read: false
  };

  authUser: any;
  name: string;


  text = '';
  element: HTMLElement;

  public data: any = [];

  @ViewChild('chat') chat;
  public messagesState: Observable<fromMessages.State>;
  private chats: Chat[];

  // New Chat!
  public newChat = false;
  public newChatId: number;
  public newChatName = '';
  public newChatImgUrl: string;

  constructor(
    private titleService: Title,
    public messageService: MessagesService,
    public media: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private _wsMessages: MessagesService,
    private router: Router,
    private store$: Store<fromApp.AppState>,
    private messageEffects$: MessageEffects,
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

    this.messageService.getMessage().subscribe(() => {
      this.scrollBottom();
    });

    this.store$.dispatch(new MessageActions.TryGetConvers());

    this.store$.pipe(select(state => state.messages)).subscribe(
      (state) => {
        if (state.messages.chats) {
          this.chats = state.messages.chats.data;

          const paramId = Number(this.activatedRoute.snapshot.params['id']);
          if (!isNaN(paramId) && this.selectedUserId !== paramId) {
            this.store$.dispatch(new MessageActions.ClearConver());

            this.selectedUser = this.findActiveChat(paramId);
            // If not found show new chat
            if (!this.selectedUser) {
              this.getNewChatInfo(paramId);
            }

            this.selectUser(paramId);
          }
        }
      });

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

    this._wsMessages.getMessage().subscribe((msg: Message) => {
      if (msg.senderId !== this.selectedUserId) {
        playNotificationSound();
      }
      this.selectedUser = this.findActiveChat(msg.senderId);
      // If not found refresh chats to get the new one
      if (!this.selectedUser) {
        this.store$.dispatch(new MessageActions.TryGetConvers());
        this.emptyNewChatValues();
      }
    });
  }

  selectUser(id: number) {
    this.scrollBottom();

    // Empty previous chat
    if (this.selectedUserId !== -1) {
      this.store$.dispatch(new MessageActions.TryMarkConverRead(this.selectedUserId));
      this.scrollBottom();
    }

    // Try to get new conver
    this.selectedUserId = id;

    if (Number(this.activatedRoute.snapshot.params['id']) !== this.selectedUserId) {
      this.router.navigate(['/messages', id]);
    }

    this.isUserSelected = true;
    this.closeDrawerIfMobile();

    this.store$.dispatch(new MessageActions.TryGetConversation(id));

    this.scrollBottom();
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

    this.messageEffects$.messagePost.pipe(
      filter((action: Action) => action.type === MessageActions.REORDER_CHATS)
    ).subscribe((next: { payload: any, type: string }) => {
      // If message for new chat
      if (this.selectedUserId === this.newChatId) {
        // Empty new chat options and fetch new chats
        this.emptyNewChatValues();
        this.store$.dispatch(new MessageActions.TryGetConvers());
      }
    });
  }

  // Helper methods

  private findActiveChat(id: number): Chat {
    if (this.chats) {
      return getActiveChatById(id, this.chats);
    }
    return undefined;
  }

  initMessage() {
    this.messageToSend = JSON.parse(JSON.stringify(this.messageToSend));
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

  getNewChatInfo(newChatId: number) {
    this.newChat = true;
    this.newChatId = newChatId;
    if (this.activatedRoute.snapshot.queryParams.img) {
      this.newChatImgUrl = this.activatedRoute.snapshot.queryParams.img;
    }
    if (this.activatedRoute.snapshot.queryParams.name) {
      this.newChatName = this.activatedRoute.snapshot.queryParams.name;
    }
  }

  private emptyNewChatValues() {
    this.newChat = false;
    this.newChatName = '';
    this.newChatId = undefined;
    this.newChatImgUrl = undefined;
  }


  // Helper methods for html

  isMobile() {
    return !this.media.isMatched('screen and (min-width: 599px)'); // gt-sm
  }

  closeDrawerIfMobile() {
    if (this.isMobile()) {
      this.drawer.toggle();
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

  getFormattedListDate(date: string, hour: string) {
    const dateDate = new Date(date);

    if (this.isNewDay(date)) {
      return dateDate.getDate() + '/' + (dateDate.getMonth() + 1) + '/' + (dateDate.getFullYear() + '').substr(2, 2);
    } else {
      return hour.substr(0, 5);
    }
  }
}
