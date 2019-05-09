import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatService, Message} from '../chat.service';
import {Observable, Subscription} from 'rxjs';
import {scan} from 'rxjs/operators';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss']
})
export class ChatDialogComponent implements OnInit, OnDestroy {

  public opened = false;
  clicked = false;
  messages: Observable<Message[]>;
  formValue: string;
  subscription: Subscription;
  @ViewChild('content') private myScrollContainer: ElementRef;

  constructor(public chat: ChatService,
              public dialog: MatDialog) {
  }

  onClickedOutside(e: Event) {
    if (this.clicked === false && this.opened) {
      this.closeDialog();
    }
    this.clicked = false;
  }

  closeDialog() {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    this.opened = false;
    document.getElementById('chat').classList.remove('expand');
  }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
      .pipe(scan((acc, val) => acc.concat(val)));
    this.messages.subscribe((holi) => {
      window.document.getElementById('content').scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
      document.getElementById('nameField').focus();
    });
  }

  sendReply(reply: string) {
    this.chat.converse(reply);
  }

  openTab(link: string) {
    window.open(link);
  }

  openDialog() {
    // this.dialog.open(DialogContentExampleDialogComponent);
    this.opened = true;
    this.clicked = true;
    document.getElementById('chat').classList.add('expand');
    document.getElementById('nameField').focus();

  }

  sendMessage() {
    if (this.formValue) {
      this.chat.converse(this.formValue);
    }
    this.formValue = '';
    document.getElementById('nameField').focus();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

@Component({
  selector: 'app-dialog-content-example-dialog',
  templateUrl: 'component.html',
  styleUrls: ['./chat-dialog.component.scss']
})
export class DialogContentExampleDialogComponent implements OnInit {

  public opened: boolean;

  messages: Observable<Message[]>;
  formValue: string;

  constructor(public chat: ChatService,
              public dialog: MatDialog) {
    this.opened = false;
  }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
      .pipe(scan((acc, val) => acc.concat(val)));
  }

  onClickedOutside(e: Event) {
    // console.log('Clicked outside:', e);
  }


  sendReply(reply: string) {
    this.chat.converse(reply);
  }

  openTab(link: string) {
    window.open(link);
  }

  sendMessage() {
    if (this.formValue) {
      this.chat.converse(this.formValue);
    }
    this.formValue = '';
  }
}
