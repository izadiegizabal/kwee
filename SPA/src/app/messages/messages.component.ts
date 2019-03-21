import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import { WebsocketService } from '../services/websocket.service';

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

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})

export class MessagesComponent implements OnInit {

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
  ) { }

  ngOnInit() {
    this.authState = this.store$.pipe(select('auth'));
    this.authState.pipe(
      select((s: { user: string }) => s.user)
    ).subscribe(
      (user) => {
        this.users.push(user);
      });

    console.log(this.users);

    this.messageService.getMessage().subscribe( msg => {
      console.log(msg);
    });

  }

  send() {
    this.messageService.sendMessage( this.text );
    this.text = '';
  }

}
