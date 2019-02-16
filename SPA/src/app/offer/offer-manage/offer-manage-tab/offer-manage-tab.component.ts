import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as OfferManageActions from '../store/offer-manage.actions';
import {PageEvent} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import * as fromOfferManage from '../store/offer-manage.reducers';

@Component({
  selector: 'app-offer-manage-tab',
  templateUrl: './offer-manage-tab.component.html',
  styleUrls: ['./offer-manage-tab.component.scss']
})
export class OfferManageTabComponent implements OnInit {
  private offerManageState: Observable<fromOfferManage.State>;

  // @Input() offers: any;
  @Input() status: number;
  @Input() type: number;
  pageSize = 2;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];
  pageEvent: PageEvent;


  constructor(private store$: Store<fromApp.AppState>, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;

    if (this.type === 0) {
      this.store$.dispatch(new OfferManageActions.TryGetOffersOfferer({
        id: 5,
        page: 1,
        limit: this.pageSize,
        status: this.status
      }));
    } else {
      this.store$.dispatch(new OfferManageActions.TryGetOffersApplicant({
        id: 4,
        page: 1,
        limit: this.pageSize,
        status: this.status
      }));
    }

    this.offerManageState = this.store$.pipe(select(state => state.OfferManage));
  }

  changePage() {
    const params = this.activatedRoute.snapshot.params;

    if (this.type === 0) {
      this.store$.dispatch(new OfferManageActions.TryGetOffersOfferer({
        id: 5,
        page: this.pageEvent.pageIndex + 1,
        limit: this.pageEvent.pageSize,
        status: this.status
      }));
    } else {
      this.store$.dispatch(new OfferManageActions.TryGetOffersApplicant({
        id: 4,
        page: this.pageEvent.pageIndex + 1,
        limit: this.pageEvent.pageSize,
        status: this.status
      }));
    }
  }
}
