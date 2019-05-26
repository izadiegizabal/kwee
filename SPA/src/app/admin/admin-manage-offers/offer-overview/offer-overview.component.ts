import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatDialog, MatPaginator, PageEvent} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as OffersActions from '../../../offer/store/offers.actions';
import {Observable} from 'rxjs';
import * as fromOffers from '../../../offer/store/offers.reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {getUrlfiedString} from '../../../shared/utils';
import {isStringNotANumber, OfferStatus, WorkLocationType} from '../../../../models/Offer.model';
import {AlertDialogComponent} from '../../../shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-offer-overview',
  templateUrl: './offer-overview.component.html',
  styleUrls: ['./offer-overview.component.scss']
})
export class OfferOverviewComponent implements OnInit, AfterViewInit {

  // paging
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  @ViewChild('paginator') paginator: MatPaginator;
  // -----
  orderby = '0';
  query: any;
  nPage = 1;

  offersState: Observable<fromOffers.State>;

  isInEditMode = false;
  isPanelOpen = false;
  updateoffer: any;

  offerForm: FormGroup;

  workLocation = Object.keys(WorkLocationType)
    .filter(isStringNotANumber)
    .map(key => ({value: WorkLocationType[key], viewValue: key}));
  states = Object
    .keys(OfferStatus)
    .filter(isStringNotANumber)
    .map(key => ({value: OfferStatus[key], viewValue: key}));

  constructor(private store$: Store<fromApp.AppState>,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private _formBuilder: FormBuilder,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params['page']) {
          this.nPage = params['page'];
        }
        if (params['limit']) {
          this.pageSize = params['limit'];
        }
      });

    this.query = {...this.query, salaryAmount: {'gte': '0'}};
    this.store$.dispatch(new OffersActions.TryGetOffers({page: this.nPage, limit: this.pageSize, params: this.query, order: this.orderby}));
    this.offersState = this.store$.pipe(select(state => state.offers));

    // this.activatedRoute.queryParams
    //   .subscribe(params => {
    //     this.query = params;
    //     this.searchCallApi();
    //   });

    this.offerForm = this._formBuilder.group({
      'title': new FormControl(null, Validators.required),
      'location': new FormControl(null, Validators.required),
      'workLocation': new FormControl(Validators.required),
      'offerState': new FormControl(Validators.required),
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const index = this.nPage;
      this.paginator.pageIndex = index - 1;
    });
  }

  edit(offer) {
    this.isInEditMode = true;
    this.offerForm.controls['title'].setValue(offer.title);
    this.offerForm.controls['location'].setValue(offer.location);
    this.offerForm.controls['workLocation'].setValue(offer.workLocation);
    this.offerForm.controls['offerState'].setValue(offer.status);
  }

  changePage() {
    this.store$.dispatch(new OffersActions.TryGetOffers({
      page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize,
      params: this.query,
      order: this.orderby
    }));
    window.scrollTo(0, 0);
    this.nPage = this.pageEvent.pageIndex + 1;
    if (this.pageSize !== this.pageEvent.pageSize) {
      this.pageSize = this.pageEvent.pageSize;
    }
    this.router.navigate(['/admin/manage-offers'],
      {queryParams: {page: this.nPage, limit: this.pageSize}, queryParamsHandling: 'merge'});
  }


  urlfyDetail(offer) {
    return '/offer/' + offer.id + '/' + getUrlfiedString(offer.title);
  }

  getOfferLocation(offer) {
    let location = offer.location ? offer.location : '';
    if (location !== '' && offer.workLocation !== WorkLocationType['On Site']) {
      location += ' - ';
      location += WorkLocationType[offer.workLocation];
    } else if (location === '') {
      location = WorkLocationType[offer.workLocation];
    }

    return location;
  }

  getOfferStatus(status) {
    return OfferStatus[status];
  }


  callAlertDialogUpdate(id) {
    const dialogDelete = this.dialog.open(AlertDialogComponent, {
      data: {
        header: 'Are you sure you want to update this offer?',
      }
    });

    dialogDelete.afterClosed().subscribe(result => {
      if (result) {
        this.updateOffers(id);
      }
    });
  }


  updateOffers(id) {
    if (this.offerForm.status === 'VALID' && id) {
      this.isInEditMode = false;
      this.isPanelOpen = false;

      this.updateoffer = {
        'title': this.offerForm.controls['title'].value,
        'location': this.offerForm.controls['location'].value,
        'workLocation': this.offerForm.controls['workLocation'].value,
        'status': this.offerForm.controls['offerState'].value,
      };

      this.store$.dispatch(new OffersActions.TryUpdateOffer({id: id, updateoffer: this.updateoffer}));
    } else {
      console.log(this.offerForm);
    }
  }

  callAlertDialogDelete(id) {
    const dialogDelete = this.dialog.open(AlertDialogComponent, {
      data: {
        header: 'Are you sure you want to delete this offer?',
      }
    });

    dialogDelete.afterClosed().subscribe(result => {
      if (result) {
        this.deleteOffer(id);
      }
    });
  }

  deleteOffer(id) {
    this.store$.dispatch(new OffersActions.TryDeleteOffer(id));
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
