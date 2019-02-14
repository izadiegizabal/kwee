import {Component, OnInit} from '@angular/core';
import * as OffersActions from '../../../candidate-home/store/offers.actions';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import {Observable} from 'rxjs';
import * as fromOffers from '../../../candidate-home/store/offers.reducers';

@Component({
  selector: 'app-offer-manage-candidate',
  templateUrl: './offer-manage-candidate.component.html',
  styleUrls: ['./offer-manage-candidate.component.scss']
})
export class OfferManageCandidateComponent implements OnInit {
  private offersState: Observable<fromOffers.State>;

  constructor(private store$: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.store$.dispatch(new OffersActions.TryGetOffers({page: 1, limit: 2}));
    this.offersState = this.store$.pipe(select(state => state.offers));
  }
}
