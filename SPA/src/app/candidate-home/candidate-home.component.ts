import {Component, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import * as OffersActions from './store/offers.actions';
import * as fromOffers from './store/offers.reducers';
import {Observable} from 'rxjs';
import {MatSidenav, PageEvent} from '@angular/material';
import {BreakpointObserver} from '@angular/cdk/layout';
import {FormControl, FormGroup} from '@angular/forms';
import {
  ContractType,
  Distances,
  isStringNotANumber,
  PublishTime,
  SalaryFrequency,
  SeniorityLevel,
  WorkLocationType
} from '../../models/Offer.model';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-candidate-home',
  templateUrl: './candidate-home.component.html',
  styleUrls: ['./candidate-home.component.scss']
})
export class CandidateHomeComponent implements OnInit {


  offersState: Observable<fromOffers.State>;
  // MatPaginator
  pageSize = 2;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  // Filter sidebar
  @ViewChild('drawer') drawer: MatSidenav;
  // Helper
  filters: FormGroup;
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
    public media: BreakpointObserver,
    private http: HttpClient) {
  }

  ngOnInit() {
    this.store$.dispatch(new OffersActions.TryGetOffers({page: 1, limit: 5}));
    this.offersState = this.store$.pipe(select(state => state.offers));

    this.filters = new FormGroup({
        'location': new FormControl(),
        'distance': new FormControl(),
        'salary': new FormControl(),
        'currency': new FormControl('EUR'),
        'frequency': new FormControl(2),
        'publishDate': new FormControl(),
        'minBusinessIndex': new FormControl(0),
        // TODO: complete this
      }
    );

    this.getJSON().subscribe(data => {
      const evrp = Object.keys(data);
      const gr = [];
      for (const prop of evrp) {
        gr.push(data[prop]);
      }
      this.auxCurrencies = gr;
    });
  }

  getJSON(): Observable<any> {
    return this.http.get('./assets/CurrenciesISO.json');
  }

  changePage() {
    this.store$.dispatch(new OffersActions.TryGetOffers({page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize}));
  }

  isMobile() {
    return !this.media.isMatched('screen and (min-width: 960px)'); // gt-sm
  }

  applyFilters() {
    this.drawer.toggle();
    window.scrollTo(0, 0);
  }
}
