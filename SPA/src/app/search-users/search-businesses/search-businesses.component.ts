import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSidenav, PageEvent} from '@angular/material';
import {Observable} from 'rxjs';
import * as fromAdmin from '../../admin/store/admin.reducers';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as AdminActions from '../../admin/store/admin.actions';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-search-businesses',
  templateUrl: './search-businesses.component.html',
  styleUrls: [
    '../../candidate-home/candidate-home.component.scss',
    './search-businesses.component.scss',
  ]
})
export class SearchBusinessesComponent implements OnInit {
  // paging
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  // MatPaginator Output
  pageEvent: PageEvent;
  adminState: Observable<fromAdmin.State>;
  @ViewChild('paginator') paginator: MatPaginator;
  query: any;
  orderby = '0';

  order: { value: string, viewValue: string }[] =
    [
      {value: '0', viewValue: 'Relevance'},
      {value: 'index', viewValue: 'Kwee Index'},
      {value: 'name', viewValue: 'Name'},
      {value: 'year', viewValue: 'Foundation Year'},
      {value: 'companySize', viewValue: 'Company Size'},
    ];


  constructor(
    private titleService: Title,
    private store$: Store<fromApp.AppState>,
    public media: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  // Filter sidebar
  @ViewChild('drawer') private _drawer: MatSidenav;

  get drawer(): MatSidenav {
    return this._drawer;
  }

  set drawer(value: MatSidenav) {
    this._drawer = value;
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Search Businesses');
    this.store$.dispatch(new AdminActions.TryGetBusinesses({
      page: 1,
      limit: 5,
      params: this.query,
      order: this.orderby
    }));
    this.adminState = this.store$.pipe(select(state => state.admin));

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.query = params;
        this.searchCallApi();
      });
  }

  changePage() {
    this.store$.dispatch(new AdminActions.TryGetBusinesses({
      page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize,
      params: this.query,
      order: this.orderby
    }));
    window.scrollTo(0, 0);
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
    } else {
      this.titleService.setTitle('Kwee - ' + searchParams);
    }
    this.router.navigate(['/search-businesses'], {queryParams: {keywords: searchParams}, queryParamsHandling: 'merge'});
  }

  getOrderby(order: string) {
    this.orderby = order;

    this.store$.dispatch(new AdminActions.TryGetBusinesses({
      page: 1,
      limit: this.pageSize,
      params: this.query,
      order: this.orderby
    }));
  }

  searchCallApi() {

    if (this.query.index) {
      this.query = {...this.query, index: {'gte': this.query.index}};
    }

    if (this.query.year) {
      this.query = {...this.query, year: {'gte': this.query.year}};
    }

    this.store$.dispatch(new AdminActions.TryGetBusinesses({
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
