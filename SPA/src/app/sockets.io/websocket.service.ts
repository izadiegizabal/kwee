import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import * as fromAuth from '../auth/store/auth.reducers';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  authState: Observable<fromAuth.State>;
  userEmail: string;

  constructor(private store$: Store<fromApp.AppState>,
              private socket: Socket) {
    // If logged in set user in server
    this.authState = this.store$.pipe(select('auth'));
    this.authState.subscribe(state => {
        if (state && state.user && state.user.email !== this.userEmail) {
          this.userEmail = state.user.email;
          this.connectUser(this.userEmail);
        }
      }
    );

    // Just in case take latest from store if lost in refresh
    if (!this.userEmail || this.userEmail === '') {
      this.store$.pipe(take(1)).subscribe(state => {
          if (state && state.auth && state.auth.user) {
            this.userEmail = state.auth.user.email;
            if (this.userEmail) {
              this.connectUser(this.userEmail);
            }
          }
        }
      );
    }

    this.checkStatus();
  }

  checkStatus() {

    this.socket.on('connect', (client) => {
      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {
      this.socketStatus = false;
    });
  }

  emit(event: string, payload?: any, callback?) {
    this.socket.emit(event, payload, callback);
  }

  listen(event: string) {
    return this.socket.fromEvent(event);
  }

  connectUser(email: string) {

    return new Promise((resolve, reject) => {
      this.emit('set-user', {email}, resp => {
        resolve();
      });
    });

  }
}
