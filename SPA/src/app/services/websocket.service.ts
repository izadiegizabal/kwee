import { Injectable } from '@angular/core';
import { User } from '../classes/user';
import { Socket } from 'ngx-socket-io';
import { _countGroupLabelsBeforeOption } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public user: User = null;

  constructor(
    private socket: Socket
  ) {
    this.getStorage();
    this.checkStatus();
  }

  checkStatus() {

    this.socket.on('connect', (client) => {
      console.log('Conectado al servidor');
      this.socketStatus = true;
      this.getStorage();
    });

    this.socket.on('disconnect', () => {
      console.log('Desonectado del servidor');
      this.socketStatus = false;
    });

    // this.socket.on('selected', function(data) {
    //   console.log('en el selected');
    //   const username: any = data.username;
    //   const message: any = data.message;

    //   alert(username + ': ' + message);
    // });
  }

  emit( event: string, payload?: any, callback?: Function ) {
    this.socket.emit( event, payload, callback );
  }

  listen( event: string ) {
    return this.socket.fromEvent( event );
  }

  selected( event: string ) {
    console.log('en el selected');

    this.socket.on('selected', function(data) {
      const username: any = data.username;
      const message: any = data.message;

      alert(username + ': ' + message);
    });
  }

  connectedUser( email: string ) {

    return new Promise(  (resolve, reject) => {

      this.emit( 'set-user', { email }, resp => {

        this.user = new User( email );
        this.setStorage();

        resolve();

      });

    });

  }

  setStorage() {
    localStorage.setItem( 'user', JSON.stringify( this.user ));
  }

  getStorage() {
    if ( localStorage.getItem('user') ) {
      this.user = JSON.parse( localStorage.getItem('user') );
      this.connectedUser( this.user.email );
    }
  }
}
