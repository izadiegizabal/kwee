import {Component, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {WorkFields} from '../../../../models/Candidate.model';
import {Distances, isStringNotANumber} from '../../../../models/Offer.model';
import {MatSidenav, PageEvent} from '@angular/material';
import {BreakpointObserver} from '@angular/cdk/layout';
import * as fromApp from '../../../store/app.reducers';
import * as fromOfferManage from '../store/offer-manage.reducers';
import * as OfferManageActions from '../store/offer-manage.actions';
import {filter} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {OfferManageEffects} from '../store/offer-manage.effects';
import {CandidatePreview} from '../../../../models/candidate-preview.model';

@Component({
  selector: 'app-offer-selection-process',
  templateUrl: './offer-selection-process.component.html',
  styleUrls: ['./offer-selection-process.component.scss']
})
export class OfferSelectionProcessComponent implements OnInit {

  // Filter sidebar
  @ViewChild('drawer') private drawer: MatSidenav;

  // PAGINATOR
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
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


  // SELECTION DATA
  private offerId: number;
  private manageOfferState: Observable<fromOfferManage.State>;
  private candidates: {
    all: CandidatePreview[],
    faved: CandidatePreview[],
    selected: CandidatePreview[]
  };

  // Stepper forms
  selectFormGroup: FormGroup;
  waitFormGroup: FormGroup;

  constructor(
    private store$: Store<fromApp.AppState>,
    public media: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private manageOfferEffects: OfferManageEffects,
    private _formBuilder: FormBuilder) {
  }

  ngOnInit() {

    // TODO: check if offer is in selection process and that the owner of the offer is the one logged in

    // Initialise stepper form
    this.selectFormGroup = this._formBuilder.group({
      selectionCtrl: ['', Validators.required]
    });
    this.waitFormGroup = this._formBuilder.group({
      waitCtrl: ['', Validators.required]
    });

    // Get Manage Offer store
    this.manageOfferState = this.store$.pipe(select(state => state.offerManage));

    // Get Candidates
    const params = this.activatedRoute.snapshot.params;
    if (Number(params.id)) {
      this.offerId = Number(params.id);
      this.store$.dispatch(new OfferManageActions.TryGetOfferCandidates({id: this.offerId, page: 1, limit: 20, status: 0})); // pending
      // this.store$.dispatch(new OfferManageActions.TryGetOfferCandidates({id: this.offerId, page: 1, limit: 20, status: 1})); // faved

      this.manageOfferEffects.GetOfferCandidates.pipe(
        filter((action: any) => action.type === OfferManageActions.OPERATION_ERROR)
      ).subscribe((error: { payload: any, type: string }) => {
        // this.router.navigate(['/error/404']);
        console.log(error);
      });
    } else {
      this.router.navigate(['/error/404']);
    }

    // Store candidates
    this.candidates = {
      all: [],
      faved: [],
      selected: []
    };
    this.manageOfferState
      .pipe(select(state => state.selection))
      .subscribe(newSelection => {
          this.candidates = newSelection;
        }
      );

    // Initialise filters
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
  }


  //////////////////////////////////////////////////////
  // FILTER HELPER METHODS /////////////////////////////
  //////////////////////////////////////////////////////

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

  onSearch($event: string) {
  }

  // Interacion with stepper methods
  closeSelectionProcess() {
    // TODO: change state of offer from selection to closed
  }

  isFaved(faved: boolean, candidate: CandidatePreview) {
    if (faved) {
      if (candidate.applicationStatus !== 1){
        this.store$.dispatch(new OfferManageActions
          .TryChangeApplicationStatus({candidateId: candidate.id, applicationId: candidate.applicationId, status: 1}));
      }
    } else {
      if (candidate.applicationStatus !== 0){
        this.store$.dispatch(new OfferManageActions
          .TryChangeApplicationStatus({candidateId: candidate.id, applicationId: candidate.applicationId, status: 0}));
      }
    }
  }
}
