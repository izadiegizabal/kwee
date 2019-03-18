import {Component, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {WorkFields} from '../../../../models/Candidate.model';
import {Distances, isStringNotANumber} from '../../../../models/Offer.model';
import {MatSidenav, MatStepper, PageEvent} from '@angular/material';
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

  // Selection process Stepper
  @ViewChild('stepper') private stepper: MatStepper;

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

  // Stepper forms
  selectFormGroup: FormGroup;
  waitFormGroup: FormGroup;
  firstStepCompletion = false;
  private secondStepCompletion = false;
  showStepper = false;

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

    // Empty previous states
    this.store$.dispatch(new OfferManageActions.EmptyState());

    // Initialise stepper form
    this.selectFormGroup = this._formBuilder.group({});
    this.waitFormGroup = this._formBuilder.group({});

    // Get Manage Offer store
    this.manageOfferState = this.store$.pipe(select(state => state.offerManage));

    // Get Candidates
    const params = this.activatedRoute.snapshot.params;

    if (Number(params.id)) {
      this.offerId = Number(params.id);
      this.store$.dispatch(new OfferManageActions.TryGetOfferCandidates({
        id: this.offerId,
        page: 1,
        limit: 20,
        status: 0
      })); // pending
      this.store$.dispatch(new OfferManageActions.TryGetOfferCandidates({
        id: this.offerId,
        page: 1,
        limit: 20,
        status: 1
      })); // faved
      this.store$.dispatch(new OfferManageActions.TryGetOfferCandidates({
        id: this.offerId,
        page: 1,
        limit: 20,
        status: 2
      })); // selected
      this.store$.dispatch(new OfferManageActions.TryGetOfferCandidates({
        id: this.offerId,
        page: 1,
        limit: 20,
        status: 3
      })); // accepted
      this.store$.dispatch(new OfferManageActions.TryGetOfferCandidates({
        id: this.offerId,
        page: 1,
        limit: 20,
        status: 4
      })); // refused

      this.store$.select(state => state.offerManage).subscribe(offerManage => {
          if (offerManage.selection) {
            if ((offerManage.selection.selected && offerManage.selection.selected.length > 0) ||
              (offerManage.selection.accepted && offerManage.selection.accepted.length > 0)) {
              this.firstStepCompletion = true;
              if (this.stepper.selectedIndex < 1) {
                this.showStepper = true;
                this.stepper.next();
              }
              if (offerManage.selection && offerManage.selection.accepted && offerManage.selection.accepted.length > 0) {
                this.secondStepCompletion = true;
                if (this.stepper.selectedIndex < 2) {
                  this.showStepper = true;
                  this.stepper.next();
                }
              } else {
                if (this.stepper.selectedIndex < 1) {
                  this.stepper.next();
                } else if (this.stepper.selectedIndex > 1) {
                  this.showStepper = true;
                  this.stepper.previous();
                }
              }
            } else {
              this.firstStepCompletion = false;
              if (this.stepper.selectedIndex !== 0) {
                this.stepper.previous();
              }
              this.showStepper = true;
            }
          }
        }
      );

      this.manageOfferEffects.GetOfferCandidates.pipe(
        filter((action: any) => action.type === OfferManageActions.OPERATION_ERROR)
      ).subscribe((error: { payload: any, type: string }) => {
        // this.router.navigate(['/error/404']);
        console.log(error);
      });

      this.manageOfferEffects.ChangeApplicationStatus.pipe(
        filter((action: any) => action.type === OfferManageActions.SET_CHANGE_APPLICATION_STATUS)
      ).subscribe((next: { payload: any, type: string }) => {
          console.log(next.payload);
          if (next.payload.status === 2) {
            this.stepper.next();
          }
        }
      );
    } else {
      this.router.navigate(['/error/404']);
    }

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

  // Interaction with stepper methods
  closeSelectionProcess() {
    this.store$.dispatch(new OfferManageActions.TryChangeOfferStatus({offerId: this.offerId, newStatus: 1}));
    this.router.navigate(['my-offers']);
  }

  isFaved(faved: boolean, candidate: CandidatePreview) {
    if (faved) {
      if (candidate.applicationStatus !== 1) {
        this.store$.dispatch(new OfferManageActions
          .TryChangeApplicationStatus({
            candidateId: candidate.id,
            applicationId: candidate.applicationId,
            status: 1,
            refresh: true,
          }));
      }
    } else {
      if (candidate.applicationStatus !== 0) {
        this.store$.dispatch(new OfferManageActions
          .TryChangeApplicationStatus({
            candidateId: candidate.id,
            applicationId: candidate.applicationId,
            status: 0,
            refresh: true
          }));
      }
    }
  }

  isSelected(selected: boolean, candidate: CandidatePreview) {
    if (selected) {
      if (candidate.applicationStatus !== 2) {
        // TODO: Show dialog of confirmation
        this.store$.dispatch(new OfferManageActions
          .TryChangeApplicationStatus({
            candidateId: candidate.id,
            applicationId: candidate.applicationId,
            status: 2,
            refresh: true
          }));
      }
    }
  }

  isRejected(rejected: boolean, candidate: CandidatePreview) {
    if (rejected) {
      // TODO: show dialog of confirmation
      this.store$.dispatch(new OfferManageActions.TryRejectApplication(candidate.applicationId));
      console.log('Reject application ' + candidate.applicationId);
    }
  }
}
