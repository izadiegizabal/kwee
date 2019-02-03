import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as OffersActions from './store/offers.actions';
import * as fromOffers from './store/offers.reducers';
import {Observable} from 'rxjs';
import {PageEvent} from '@angular/material';


@Component({
  selector: 'app-candidate-home',
  templateUrl: './candidate-home.component.html',
  styleUrls: ['./candidate-home.component.scss']
})
export class CandidateHomeComponent implements OnInit {
  offersState: Observable<fromOffers.State>;

  pageSize = 2;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(private store$: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.store$.dispatch(new OffersActions.TryGetOffers({page: 1, limit: 2}));
    this.offersState = this.store$.pipe(select(state => state.offers));
  }

  changepage() {
    this.store$.dispatch(new OffersActions.TryGetOffers({page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize}));
    this.offersState = this.store$.pipe(select(state => state.offers));
  }

}
