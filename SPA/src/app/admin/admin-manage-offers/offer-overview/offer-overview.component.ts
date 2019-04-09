import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, PageEvent} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as OffersActions from '../../../offer/store/offers.actions';
import {Observable} from 'rxjs';
import * as fromOffers from '../../../offer/store/offers.reducers';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-offer-overview',
  templateUrl: './offer-overview.component.html',
  styleUrls: ['./offer-overview.component.scss']
})
export class OfferOverviewComponent implements OnInit {

  // paging
  pageSize = 5;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  @ViewChild('paginator') paginator: MatPaginator;
  // -----
  orderby = '0';
  query: any;

  offersState: Observable<fromOffers.State>;

  isInEditMode = false;
  isPanelOpen = false;
  updateoffer: any;

  userForm: FormGroup;


  constructor(private store$: Store<fromApp.AppState>,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private _formBuilder: FormBuilder,
              public dialog: MatDialog) {
  }

  ngOnInit() {

    this.query = {...this.query, status: '0'};
    this.store$.dispatch(new OffersActions.TryGetOffers({page: 1, limit: 5, params: this.query, order: this.orderby}));
    this.offersState = this.store$.pipe(select(state => state.offers));

    // this.activatedRoute.queryParams
    //   .subscribe(params => {
    //     this.query = params;
    //     this.searchCallApi();
    //   });
  }

  changePage() {
    this.store$.dispatch(new OffersActions.TryGetOffers({
      page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize,
      params: this.query,
      order: this.orderby
    }));
    window.scrollTo(0, 0);
  }

  // For search
  // getOrderby(order: string) {
  //   // console.log(order);
  //   this.orderby = order;
  //
  //   this.store$.dispatch(new OffersActions.TryGetOffers({
  //     page: 1,
  //     limit: this.pageSize,
  //     params: this.query,
  //     order: this.orderby
  //   }));
  // }
  //
  //
  // searchCallApi() {
  //   this.query = {...this.query, status: '0'};
  //   if (this.query.salaryAmount) {
  //     this.query = {...this.query, salaryAmount: {'gte': this.query.salaryAmount}};
  //   }
  //
  //   if (this.query.offererIndex) {
  //     this.query = {...this.query, offererIndex: {'gte': this.query.offererIndex}};
  //   }
  //
  //   if (this.query.datePublished) {
  //     this.query = {...this.query, datePublished: {'gte': this.query.datePublished}};
  //   }
  //
  //   if (this.query.keywords) {
  //     this.titleService.setTitle('Kwee - ' + this.query.keywords);
  //     this.alreadySearched = this.query.keywords;
  //   } else {
  //     this.titleService.setTitle('Kwee - Candidate Home');
  //     this.alreadySearched = '';
  //   }
  //
  //   this.store$.dispatch(new OffersActions.TryGetOffers({
  //     page: 1,
  //     limit: this.pageSize,
  //     params: this.query,
  //     order: this.orderby
  //   }));
  //
  //   if (this.paginator) {
  //     this.paginator.firstPage();
  //   }
  // }
}
