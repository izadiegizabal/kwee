import {Component, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as OffersActions from '../offer/store/offers.actions';
import * as fromOffers from '../offer/store/offers.reducers';
import {Observable} from 'rxjs';
import {MatPaginator, MatSidenav, PageEvent} from '@angular/material';
import {BreakpointObserver} from '@angular/cdk/layout';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-candidate-home',
  templateUrl: './candidate-home.component.html',
  styleUrls: ['./candidate-home.component.scss']
})
export class CandidateHomeComponent implements OnInit {

  query: any;
  offersState: Observable<fromOffers.State>;
  // MatPaginator
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  orderby = '0';
  @ViewChild('paginator') paginator: MatPaginator;

  // Filter sidebar
  @ViewChild('drawer') drawer: MatSidenav;

  order: { value: string, viewValue: string }[] =
    [
      {value: '0', viewValue: 'Relevance'},
      {value: 'index', viewValue: 'Kwee Index'},
      {value: 'title', viewValue: 'Title'},
      {value: 'salaryAmount', viewValue: 'Salary'},
      {value: 'dateStart', viewValue: 'Start Date'},
      {value: 'datePublished', viewValue: 'Published Date'},
      {value: 'dateEnd', viewValue: 'Selection Date'},
      {value: 'seniority', viewValue: 'Seniority'},
    ];

  alreadySearched = '';


  constructor(
    private titleService: Title,
    private store$: Store<fromApp.AppState>,
    public media: BreakpointObserver,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Candidate Home');

    this.query = {...this.query, status: '0'};
    this.store$.dispatch(new OffersActions.TryGetOffers({page: 1, limit: 5, params: this.query, order: this.orderby}));
    this.offersState = this.store$.pipe(select(state => state.offers));

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.query = params;
        this.searchCallApi();
      });
  }

  changePage() {
    this.store$.dispatch(new OffersActions.TryGetOffers({
      page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize,
      params: this.query,
      order: this.orderby
    }));
  }

  isMobile() {
    return !this.media.isMatched('screen and (min-width: 960px)'); // gt-sm
  }


  onSearch(params: string) {
    let searchParams = params.toLowerCase().replace(/ /g, '+');

    if (!searchParams) {
      searchParams = null;
    } else {
      this.titleService.setTitle('Kwee - ' + searchParams);
    }
    this.router.navigate(['/candidate-home'], {queryParams: {title: searchParams}, queryParamsHandling: 'merge'});
  }

  getOrderby(order: string) {
    // console.log(order);
    this.orderby = order;

    this.store$.dispatch(new OffersActions.TryGetOffers({
      page: 1,
      limit: this.pageSize,
      params: this.query,
      order: this.orderby
    }));
  }


  searchCallApi() {
    this.query = {...this.query, status: '0'};
    if (this.query.salaryAmount) {
      this.query = {...this.query, salaryAmount: {'gte': this.query.salaryAmount}};
    }

    if (this.query.offererIndex) {
      this.query = {...this.query, offererIndex: {'gte': this.query.offererIndex}};
    }

    if (this.query.datePublished) {
      this.query = {...this.query, datePublished: {'gte': this.query.datePublished}};
    }

    if (this.query.title) {
      this.titleService.setTitle('Kwee - ' + this.query.title);
      this.alreadySearched = this.query.title;
    } else {
      this.titleService.setTitle('Kwee - Candidate Home');
      this.alreadySearched = '';
    }

    this.store$.dispatch(new OffersActions.TryGetOffers({
      page: 1,
      limit: this.pageSize,
      params: this.query,
      order: this.orderby
    }));

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
}
