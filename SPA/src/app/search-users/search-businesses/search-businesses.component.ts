import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav, PageEvent} from '@angular/material';
import {Observable} from 'rxjs';
import * as fromAdmin from '../../admin/store/admin.reducers';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as AdminActions from '../../admin/store/admin.actions';
import {FormControl, FormGroup} from '@angular/forms';
import {Distances, isStringNotANumber} from '../../../models/Offer.model';
import {BreakpointObserver} from '@angular/cdk/layout';
import {BusinessIndustries, BusinessSize} from '../../../models/Business.model';

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


  // FILTERS
  filters: FormGroup;

  distances = Object.keys(Distances)
    .filter(isStringNotANumber)
    .map(key => ({value: Distances[key], viewValue: key}));
  industries = Object.keys(BusinessIndustries)
    .filter(isStringNotANumber)
    .map(key => ({value: BusinessIndustries[key], viewValue: key}));
  openOfferNum = [
    {value: 0, viewValue: 'Doesn\'t matter'},
    {value: 1, viewValue: 'More than 1'},
    {value: 3, viewValue: 'More than 3'},
    {value: 8, viewValue: 'More than 8'},
    {value: 12, viewValue: 'More than 12'},
  ];

  companySizes = Object
    .keys(BusinessSize)
    .filter(isStringNotANumber)
    .map(key => ({value: BusinessSize[key], viewValue: key}));

  constructor(
    private store$: Store<fromApp.AppState>,
    public media: BreakpointObserver) {
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
    this.store$.dispatch(new AdminActions.TryGetBusinesses({page: 1, limit: 5}));
    this.adminState = this.store$.pipe(select(state => state.admin));

    this.filters = new FormGroup({
        'location': new FormControl(),
        'distance': new FormControl(),
        'industry': new FormControl(),
        'foundationDate': new FormControl(),
        'minIndex': new FormControl(0),
        'minRatings': new FormControl(0),
        'openOffers': new FormControl(),
        'companySize': new FormControl(),
        // TODO: complete this
      }
    );
  }

  changePage() {
    this.store$.dispatch(new AdminActions.TryGetBusinesses({page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize}));
  }

  isMobile() {
    return !this.media.isMatched('screen and (min-width: 960px)'); // gt-sm
  }

  applyFilters() {
    this.drawer.toggle();
    window.scrollTo(0, 0);
  }
}
