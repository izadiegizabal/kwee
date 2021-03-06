import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as OffersActions from '../offer/store/offers.actions';
import * as fromOffers from '../offer/store/offers.reducers';
import {Observable} from 'rxjs';
import {MatPaginator, MatSidenav, PageEvent} from '@angular/material';
import {BreakpointObserver} from '@angular/cdk/layout';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-candidate-home',
  templateUrl: './candidate-home.component.html',
  styleUrls: ['./candidate-home.component.scss']
})
export class CandidateHomeComponent implements OnInit, AfterViewInit {

  query: any;
  offersState: Observable<fromOffers.State>;
  // MatPaginator
  pageSize = 5;
  nPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  orderby = '0';
  changeP = false;

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
    this.store$.dispatch(new OffersActions.TryGetOffers({page: this.nPage, limit: this.pageSize, params: this.query, order: this.orderby}));
    this.offersState = this.store$.pipe(select(state => state.offers));

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.query = params;
        this.query = {...this.query, status: '0'};
        if (params['page']) {
          this.nPage = params['page'];
        }
        if (params['limit']) {
          this.pageSize = params['limit'];
        }

        if (!this.changeP) {
          this.searchCallApi();
        } else {
          this.changeP = false;
        }
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const index = this.nPage;
      if (this.paginator) {
        this.paginator.pageIndex = index - 1;
      }
    });
  }


  changePage() {
    this.changeP = true;
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
    this.router.navigate(['/candidate-home'],
      {queryParams: {page: this.nPage, limit: this.pageSize}, queryParamsHandling: 'merge'});
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
    this.router.navigate(['/candidate-home'], {queryParams: {keywords: searchParams}, queryParamsHandling: 'merge'});
  }

  getOrderby(order: string) {
    // console.log(order);
    this.orderby = order;

    this.store$.dispatch(new OffersActions.TryGetOffers({
      page: this.nPage,
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

    if (this.query.keywords) {
      this.titleService.setTitle('Kwee - ' + this.query.keywords);
      this.alreadySearched = this.query.keywords;
    } else {
      this.titleService.setTitle('Kwee - Candidate Home');
      this.alreadySearched = '';
    }

    this.store$.dispatch(new OffersActions.TryGetOffers({
      page: this.nPage,
      limit: this.pageSize,
      params: this.query,
      order: this.orderby
    }));

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

}
