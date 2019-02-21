import {Component, OnInit} from '@angular/core';
import {ChatService, Message} from '../chat.service';
import {Observable} from 'rxjs';
import {scan} from 'rxjs/operators';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss']
})
export class ChatDialogComponent implements OnInit {

  public opened = false;

  clicked = false;
  messages: Observable<Message[]>;
  formValue: string;

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
    this.opened = false;
    document.getElementById('chat').classList.remove('expand');
  }

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation.asObservable()
      .pipe(scan((acc, val) => acc.concat(val)));
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
  }

  sendMessage() {
    if (this.formValue) {
      this.chat.converse(this.formValue);
    }
    this.formValue = '';
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
    console.log('Clicked outside:', e);
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
