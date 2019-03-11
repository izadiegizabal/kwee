import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import * as fromAdmin from '../../admin/store/admin.reducers';
import {MatSidenav, PageEvent} from '@angular/material';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as AdminActions from '../../admin/store/admin.actions';
import {BreakpointObserver} from '@angular/cdk/layout';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {Distances, isStringNotANumber} from '../../../models/Offer.model';
import {WorkFields} from '../../../models/Candidate.model';
import {ActivatedRoute, Router} from '@angular/router';
import * as OffersActions from '../../candidate-home/store/offers.actions';

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
    this.store$.dispatch(new AdminActions.TryGetCandidates({page: 1, limit: 5}));
    this.adminState = this.store$.pipe(select(state => state.admin));

    this.activatedRoute.queryParams
      .subscribe(query => {
        console.log(query);
        this.searchCallApi();
      });
  }

  changePage() {
    // TODO: complete this
    // let query = '';
    // if (window.location.href.split('?')[1]) {
    //   query = '&' + window.location.href.split('?')[1];
    // }
    //
    // query += '&status=0';
    //
    // this.pageSize = this.pageEvent.pageSize;
    // this.store$.dispatch(new OffersActions.TryGetOffers({
    //   page: this.pageEvent.pageIndex + 1,
    //   limit: this.pageEvent.pageSize,
    //   params: query
    // }));
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
    this.router.navigate(['/search-candidates'], {queryParams: {keywords: searchParams}, queryParamsHandling: 'merge'});
  }


  searchCallApi() {
    // TODO: complete this
    // let query = '';
    // if (window.location.href.split('?')[1]) {
    //   query = '&' + window.location.href.split('?')[1];
    // }
    //
    // query += '&status=0';
    //
    // this.store$.dispatch(new OffersActions.TryGetOffers({
    //   page: 1,
    //   limit: this.pageSize,
    //   params: query
    // }));
    //
    // if (this.paginator) {
    //   this.paginator.firstPage();
    // }
  }

}
