import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav, PageEvent} from '@angular/material';
import {Observable} from 'rxjs';
import * as fromAdmin from '../../admin/store/admin.reducers';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as AdminActions from '../../admin/store/admin.actions';
import {FormControl, FormGroup} from '@angular/forms';
import {
  ContractType,
  Distances,
  isStringNotANumber,
  PublishTime,
  SalaryFrequency,
  SeniorityLevel,
  WorkLocationType
} from '../../../models/Offer.model';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-search-businesses',
  templateUrl: './search-businesses.component.html',
  styleUrls: [
    './search-businesses.component.scss',
    '../../candidate-home/candidate-home.component.scss'
  ]
})
export class SearchBusinessesComponent implements OnInit {
  // paging
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  // MatPaginator Output
  pageEvent: PageEvent;
  adminState: Observable<fromAdmin.State>;
  // Helper
  filters: FormGroup;
  // -----
  distances = Object.keys(Distances)
    .filter(isStringNotANumber)
    .map(key => ({value: Distances[key], viewValue: key}));
  workLocations = Object.keys(WorkLocationType)
    .filter(isStringNotANumber)
    .map(key => ({value: WorkLocationType[key], viewValue: key}));
  jobTypes = Object.keys(ContractType)
    .filter(isStringNotANumber)
    .map(key => ({value: ContractType[key], viewValue: key}));
  frequencies = Object.keys(SalaryFrequency)
    .filter(isStringNotANumber)
    .map(key => ({value: SalaryFrequency[key], viewValue: key}));
  auxCurrencies: any[];
  experienceLevels = Object.keys(SeniorityLevel)
    .filter(isStringNotANumber)
    .map(key => ({value: SeniorityLevel[key], viewValue: key}));
  publishTimes = Object.keys(PublishTime)
    .filter(isStringNotANumber)
    .map(key => ({value: PublishTime[key], viewValue: key}));

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
    console.log('init');
    this.store$.dispatch(new AdminActions.TryGetBusinesses({page: 1, limit: 5}));
    this.adminState = this.store$.pipe(select(state => state.admin));

    this.filters = new FormGroup({
        'location': new FormControl(),
        'distance': new FormControl(),
        'salary': new FormControl(),
        'currency': new FormControl('EUR'),
        'frequency': new FormControl(2),
        'publishDate': new FormControl(),
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
