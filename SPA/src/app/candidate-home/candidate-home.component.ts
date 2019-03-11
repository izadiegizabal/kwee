import {Component, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as OffersActions from './store/offers.actions';
import * as fromOffers from './store/offers.reducers';
import {Observable} from 'rxjs';
import {MatPaginator, MatSidenav, PageEvent} from '@angular/material';
import {BreakpointObserver} from '@angular/cdk/layout';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-candidate-home',
  templateUrl: './candidate-home.component.html',
  styleUrls: ['./candidate-home.component.scss']
})
export class CandidateHomeComponent implements OnInit {


  offersState: Observable<fromOffers.State>;
  // MatPaginator
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  @ViewChild('paginator') paginator: MatPaginator;

  // Filter sidebar
  @ViewChild('drawer') drawer: MatSidenav;


  constructor(
    private store$: Store<fromApp.AppState>,
    public media: BreakpointObserver,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.store$.dispatch(new OffersActions.TryGetOffers({page: 1, limit: 5, params: '&status=0'}));
    this.offersState = this.store$.pipe(select(state => state.offers));

    this.activatedRoute.queryParams
      .subscribe(query => {
        this.searchCallApi();
      });
  }

  changePage() {
    let query = '';
    if (window.location.href.split('?')[1]) {
      query = '&' + window.location.href.split('?')[1];
    }

    query += '&status=0';

    this.pageSize = this.pageEvent.pageSize;
    this.store$.dispatch(new OffersActions.TryGetOffers({
      page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize,
      params: query
    }));
  }

  isMobile() {
    return !this.media.isMatched('screen and (min-width: 960px)'); // gt-sm
  }

  applyFilters() {
    this.drawer.toggle();
    window.scrollTo(0, 0);
  }

  onSearch(params: string) {
    let searchParams = params.toLowerCase().replace(/ /g, '+');
    if (!searchParams) {
      searchParams = null;
    }
    this.router.navigate(['/candidate-home'], {queryParams: {keywords: searchParams}, queryParamsHandling: 'merge'});
  }

  searchCallApi() {
    let query = '';
    if (window.location.href.split('?')[1]) {
      query = '&' + window.location.href.split('?')[1];
    }

    query += '&status=0';

    this.store$.dispatch(new OffersActions.TryGetOffers({
      page: 1,
      limit: this.pageSize,
      params: query
    }));

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
}
