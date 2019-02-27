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

  // FILTERS
  filters: FormGroup;
  isSkill = 0;
  isLang = 0;

  workfields = Object.keys(WorkFields)
    .filter(isStringNotANumber)
    .map(key => ({value: WorkFields[key], viewValue: key}));
  distances = Object.keys(Distances)
    .filter(isStringNotANumber)
    .map(key => ({value: Distances[key], viewValue: key}));

  constructor(
    private store$: Store<fromApp.AppState>,
    public media: BreakpointObserver) {
  }

  ngOnInit() {
    this.store$.dispatch(new AdminActions.TryGetCandidates({page: 1, limit: 5}));
    this.adminState = this.store$.pipe(select(state => state.admin));

    this.filters = new FormGroup({
        'location': new FormControl(),
        'distance': new FormControl(),
        'workfield': new FormControl(),
        'minAge': new FormControl(),
        'maxAge': new FormControl(),
        'minIndex': new FormControl(0),
        'minRatings': new FormControl(0),
        'openOffers': new FormControl(),
        'companySize': new FormControl(),
        'skills': new FormArray([new FormControl(null)]),
        'languages': new FormArray([new FormControl(null)]),
        // TODO: complete this
      }
    );
  }

  changePage() {
    this.store$.dispatch(new AdminActions.TryGetCandidates({page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize}));
  }

  isMobile() {
    return !this.media.isMatched('screen and (min-width: 960px)'); // gt-sm
  }

  applyFilters() {
    this.drawer.toggle();
    window.scrollTo(0, 0);
  }

  get formSkills() {
    return <FormArray>this.filters.get('skills');
  }

  get formLanguages() {
    return <FormArray>this.filters.get('languages');
  }

  addSkill() {
    (<FormArray>this.filters.controls['skills']).push(new FormControl(null));
    this.isSkill++;
    // console.log(this.formSkills.length);
    setTimeout(() => {
      document.getElementById(`skill${this.isSkill}`).focus();
    }, 1);
  }

  deleteSkill(i) {
    (<FormArray>this.filters.controls['skills']).removeAt(i);
    this.isSkill--;
  }

  addLang() {
    (<FormArray>this.filters.controls['languages']).push(new FormControl(null));
    this.isLang++;
    setTimeout(() => {
      document.getElementById(`language${this.isLang}`).focus();
    }, 1);
  }

  delLang(i) {
    (<FormArray>this.filters.controls['languages']).removeAt(i);
    this.isLang--;
  }
}
