import {Component, OnInit} from '@angular/core';
import * as AuthActions from '../../../auth/store/auth.actions';
import * as fromApp from '../../../store/app.reducers';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
  }

  logOut() {
    this.store.dispatch(new AuthActions.Logout());
  }

}
