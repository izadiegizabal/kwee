import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as OfferManageActions from '../store/offer-manage.actions';
import {PageEvent} from '@angular/material';
import {Observable} from 'rxjs';
import * as fromOfferManage from '../store/offer-manage.reducers';
import {filter} from 'rxjs/operators';
import {OfferManageEffects} from '../store/offer-manage.effects';
import {changeAngle} from '../../../../assets/engine/commons';

@Component({
  selector: 'app-offer-manage-tab',
  templateUrl: './offer-manage-tab.component.html',
  styleUrls: ['./offer-manage-tab.component.scss']
})
export class OfferManageTabComponent implements OnInit {
  // @Input() offers: any;
  @Input() status: number;
  @Input() type: number;
  id: number;
  pageSize = 2;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];
  pageEvent: PageEvent;
  public offerManageState: Observable<fromOfferManage.State>;
  private authState: Observable<any>;

  constructor(
    private store$: Store<fromApp.AppState>,
    private manageOfferEffects: OfferManageEffects) {
  }

  ngOnInit() {

    this.authState = this.store$.pipe(select('auth'));
    // Listen to changes on store
    this.authState.pipe(
      select(s => s.user)
    ).subscribe(
      (user) => {
        if (user && user.name && user.id) {
          this.id = user.id;
        }
      });

    if (this.id && this.type === 0) {
      this.store$.dispatch(new OfferManageActions.TryGetOffersOfferer({
        id: this.id,
        page: 1,
        limit: this.pageSize,
        status: this.status
      }));
    } else {
      this.store$.dispatch(new OfferManageActions.TryGetOffersApplicant({
        id: this.id,
        page: 1,
        limit: this.pageSize,
        status: this.status
      }));
    }

    this.offerManageState = this.store$.pipe(select(state => state.offerManage));
  }

  changePage() {

    if (this.type === 0) {
      this.store$.dispatch(new OfferManageActions.TryGetOffersOfferer({
        id: this.id,
        page: this.pageEvent.pageIndex + 1,
        limit: this.pageEvent.pageSize,
        status: this.status
      }));
    } else {
      this.store$.dispatch(new OfferManageActions.TryGetOffersApplicant({
        id: this.id,
        page: this.pageEvent.pageIndex + 1,
        limit: this.pageEvent.pageSize,
        status: this.status
      }));
    }

    window.scrollTo(0, 0);
  }

  totalOffers(count) {
    switch (this.status) {
      case -1:
        return count[0].Total;
        break;

      case 0:
        return count[2].Open;
        break;

      case 1:
        return count[4].Closed;
        break;

      case 2:
        return count[1].Draft;
        break;

      case 3:
        return count[3].Selection;
        break;
    }
  }
}
