import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import {Observable} from 'rxjs';
import * as fromAuth from '../../auth/store/auth.reducers';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-offer-manage',
  templateUrl: './offer-manage.component.html',
  styleUrls: ['./offer-manage.component.scss']
})
export class OfferManageComponent implements OnInit {
  authState: Observable<fromAuth.State>;

  constructor(
    private titleService: Title,
    private store$: Store<fromApp.AppState>
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - My Offers');
    this.authState = this.store$.pipe(select('auth'));
  }

}
