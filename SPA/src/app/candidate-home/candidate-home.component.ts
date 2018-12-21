import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as OffersActions from './store/offers.actions';
import * as fromOffers from './store/offers.reducers';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-candidate-home',
  templateUrl: './candidate-home.component.html',
  styleUrls: ['./candidate-home.component.scss']
})
export class CandidateHomeComponent implements OnInit {
  offersState: Observable<fromOffers.State>;

  constructor(private store$: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.store$.dispatch(new OffersActions.TryGetOffers());
    this.offersState = this.store$.pipe(select(state => state.offers));
  }

}
