import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import {MatPaginator, PageEvent} from '@angular/material';
import * as OfferManageActions from '../../../offer/offer-manage/store/offer-manage.actions';

@Component({
  selector: 'app-business-past-offers',
  templateUrl: './business-open-offers.component.html',
  styleUrls: ['./business-open-offers.component.scss']
})
export class BusinessOpenOffersComponent implements OnInit {

  @Input() businessID: number;

  // MatPaginator
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  query: any;
  orderBy = '0';
  @ViewChild('paginator') paginator: MatPaginator;

  constructor(public store$: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    if (this.businessID > -1) {
      this.store$.dispatch(new OfferManageActions.TryGetOffersOfferer({
        id: this.businessID,
        page: 1,
        limit: this.pageSize,
        status: 0
      }));
    }
  }

  changePage() {
    this.store$.dispatch(new OfferManageActions.TryGetOffersOfferer({
      id: this.businessID,
      page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize,
      status: 0
    }));
    window.scrollTo(0, 0);
  }
}
