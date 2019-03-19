import {Component, Input, OnInit} from '@angular/core';
import * as AuthActions from '../../../auth/store/auth.actions';
import * as fromApp from '../../../store/app.reducers';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as fromAuth from '../../../auth/store/auth.reducers';
import {getUrlfiedString} from '../../../shared/utils.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  @Input() isLanding = false;

  authState: Observable<fromAuth.State>;
  username = '';
  userId = '';
  userType = '';

  constructor(private store$: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.authState = this.store$.pipe(select('auth'));
    // Listen to changes on store
    this.authState.pipe(
      select(s => s.user)
    ).subscribe(
      (user) => {
        if (user && user.name && user.id) {
          this.username = user.name;
          this.userId = '' + user.id;
          this.userType = user.type;
        }
      });
  }

  logOut() {
    this.store$.dispatch(new AuthActions.Logout());
  }

  urlfyUser() {
    return getUrlfiedString(this.username);
  }
}
