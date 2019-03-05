import {Injectable, OnInit} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import {map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as fromAuth from './store/auth.reducers';

@Injectable({providedIn: 'root'})
export class AuthService implements OnInit {

  helper: JwtHelperService;
  authState: Observable<fromAuth.State>;
  auth = false;

  constructor(
    private store$: Store<fromApp.AppState>,
  ) {
    this.helper = new JwtHelperService();
  }

  ngOnInit() {
  }

  public isAuthenticated(): Observable<boolean> {
    return this.store$.pipe(
      select(state => state.auth),
      map(authed => {
        if (authed && authed.token) {
          return !this.helper.isTokenExpired(authed.token);
        } else {
          return false;
        }
      }),
      take(1)
    );
  }

  public getUserType(): Observable<string> {
    return this.store$.pipe(
      select(state => state.auth.user),
      map(user => {
        if (user && user.type) {
          return user.type;
        } else {
          return '';
        }
      }),
      take(1)
    );
  }
}
