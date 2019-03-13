import {Injectable, OnInit} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import {map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as fromAuth from './store/auth.reducers';
import * as AuthActions from './store/auth.actions';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService implements OnInit {

  helper: JwtHelperService;
  authState: Observable<fromAuth.State>;
  auth = false;

  constructor(
    private store$: Store<fromApp.AppState>,
    private router: Router
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
          if (this.helper.isTokenExpired(authed.token)) {
            // if token expired -> logout
            this.store$.dispatch(new AuthActions.Logout());
            this.router.navigate(['signin']);
            // redirect to login
            return false;
          } else {
            return true;
          }
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
