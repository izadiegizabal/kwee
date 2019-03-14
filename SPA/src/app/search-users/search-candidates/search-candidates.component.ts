import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import * as fromAdmin from '../../admin/store/admin.reducers';
import {MatPaginator, MatSidenav, PageEvent} from '@angular/material';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as AdminActions from '../../admin/store/admin.actions';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-search-candidates',
  templateUrl: './search-candidates.component.html',
  styleUrls: [
    '../../candidate-home/candidate-home.component.scss',
    './search-candidates.component.scss',
  ]
})
export class SearchCandidatesComponent implements OnInit {

  // Filter sidebar
  @ViewChild('drawer') private drawer: MatSidenav;
  @ViewChild('paginator') paginator: MatPaginator;

  query: any;
  adminState: Observable<fromAdmin.State>;

  // paging
  pageSize = 5;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  // MatPaginator Output
  pageEvent: PageEvent;


  constructor(
    private store$: Store<fromApp.AppState>,
    public media: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.store$.dispatch(new AdminActions.TryGetCandidates({page: 1, limit: 5, params: this.query}));
    this.adminState = this.store$.pipe(select(state => state.admin));

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.query = params;
        this.searchCallApi();
      });
  }

  changePage() {
    this.store$.dispatch(new AdminActions.TryGetCandidates({
      page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize,
      params: this.query
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
    this.router.navigate(['/search-candidates'], {queryParams: {name: searchParams}, queryParamsHandling: 'merge'});
  }


  searchCallApi() {
    if (this.query.index) {
      this.query = {...this.query, index: {'gte': this.query.index}};
    }

    // if (this.query.offererIndex) {
    //   this.query = {...this.query, offererIndex: {'gte': this.query.offererIndex}};
    // }

    // if (this.query.datePublished) {
    //   this.query = {...this.query, datePublished: {'gte': this.query.datePublished}};
    // }


    this.store$.dispatch(new AdminActions.TryGetCandidates({
      page: 1,
      limit: this.pageSize,
      params: this.query
    }));

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

}
