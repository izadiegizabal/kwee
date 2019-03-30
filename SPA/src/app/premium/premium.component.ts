import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import {Observable} from 'rxjs';
import * as fromAuth from '../auth/store/auth.reducers';
import {Router} from '@angular/router';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit {
  authState: Observable<fromAuth.State>;

  constructor(private store$: Store<fromApp.AppState>, private router: Router) {
  }

  ngOnInit() {
    this.authState = this.store$.pipe(select('auth'));

    this.authState.pipe(
      select(s => s.user)
    ).subscribe(
      (user) => {
        if (!user) {
          this.router.navigate(['error/403']);
        }
      });
  }

}
