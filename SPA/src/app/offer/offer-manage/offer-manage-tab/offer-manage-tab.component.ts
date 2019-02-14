import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as OffersActions from '../../../candidate-home/store/offers.actions';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-offer-manage-tab',
  templateUrl: './offer-manage-tab.component.html',
  styleUrls: ['./offer-manage-tab.component.scss']
})
export class OfferManageTabComponent implements OnInit {
  @Input() offers: any;
  @Input() status: number;
  pageSize = 2;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];
  pageEvent: PageEvent;

  constructor(private store$: Store<fromApp.AppState>) {
  }

  ngOnInit() {
  }

  changePage() {
    // TODO: change it with the status parameter
    this.store$.dispatch(new OffersActions.TryGetOffers({page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize}));
  }
}
