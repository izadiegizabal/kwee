import {Component, OnInit} from '@angular/core';
import * as fromApp from '../../store/app.reducers';
import * as fromAuth from '../../auth/store/auth.reducers';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  authState: Observable<fromAuth.State>;

  constructor(private store$: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.authState = this.store$.pipe(select('auth'));
  }
}
