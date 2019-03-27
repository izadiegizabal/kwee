import {Component, OnInit, ViewChild} from '@angular/core';
import {Action, select, Store} from '@ngrx/store';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
import * as OfferActions from '../../offer-detail/store/offer.actions';
import * as fromOffer from '../../offer-detail/store/offer.reducers';
import {OfferEffects} from '../../offer-detail/store/offer.effects';
import {Title} from '@angular/platform-browser';
import {Location} from '@angular/common';

@Component({
  selector: 'app-offer-selection-process',
  templateUrl: './offer-selection-process.component.html',
  styleUrls: ['./offer-selection-process.component.scss']
})
export class OfferSelectionProcessComponent implements OnInit {

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
  // Offer state
  offerState: Observable<fromOffer.State>;
  manageOfferState: Observable<fromOfferManage.State>;
  // Stepper forms
  selectFormGroup: FormGroup;
  waitFormGroup: FormGroup;
  firstStepCompletion = false;
  secondStepCompletion = false;
  firstStepOkay = false;
  secondStepOkay = false;
  showStepper = false;
  offer: any;
  currentSelected: number;
  // Filter sidebar
  @ViewChild('drawer') private drawer: MatSidenav;
  // Selection process Stepper
  @ViewChild('stepper') private stepper: MatStepper;
  // SELECTION DATA
  private offerId: number;

  constructor(
    private _formBuilder: FormBuilder,
    private titleService: Title,
    private store$: Store<fromApp.AppState>,
    private offerEffects$: OfferEffects,
    public media: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private manageOfferEffects: OfferManageEffects
  ) {
  }

  get formSkills() {
    return <FormArray>this.filters.get('skills');
  }

  get formLanguages() {
    return <FormArray>this.filters.get('languages');
  }


  //////////////////////////////////////////////////////
  // FILTER HELPER METHODS /////////////////////////////
  //////////////////////////////////////////////////////

  ngOnInit() {
    this.titleService.setTitle('Kwee - Selection Process');

    // Initialise stepper forms
    this.selectFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.waitFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    // TODO: check if offer is in selection process and that the owner of the offer is the one logged in

    // Empty previous states
    this.store$.dispatch(new OfferManageActions.EmptyState());

    // Get Manage Offer store
    this.manageOfferState = this.store$.pipe(select(state => state.offerManage));

    // Get Candidates
    const params = this.activatedRoute.snapshot.params;

    if (Number(params.id)) {

      // Get offer
      this.store$.dispatch(new OfferActions.TryGetOffer({id: params.id}));
      this.offerState = this.store$.pipe(select(state => state.offer));
      this.offerState.subscribe(
        offer => {
          this.offer = offer.offer;
          this.titleService.setTitle('Kwee - Selecting for ' + offer.offer.title);
        }
      );

      this.offerEffects$.offerGetoffer.pipe(
        filter((action: Action) => action.type === OfferActions.OPERATION_ERROR)
      ).subscribe((error: { payload: any, type: string }) => {
        this.router.navigate(['/error/404']);
      });

      // Get applications
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

      // Restore Stepper position
      this.store$.select(state => state.offerManage).subscribe(offerManage => {
          // If applications loaded
          if (offerManage.selection &&
            offerManage.selection.all &&
            offerManage.selection.faved &&
            offerManage.selection.selected &&
            offerManage.selection.accepted &&
            offerManage.selection.refused &&
            this.offer) {

            this.currentSelected = offerManage.selection.selected.length + offerManage.selection.accepted.length;

            this.showStepper = true;

            // First stepper step completion control
            if (offerManage.selection.selected.length + offerManage.selection.accepted.length >= this.offer.maxApplicants) {
              this.firstStepCompletion = true;
              this.firstStepOkay = true;
            } else if (offerManage.selection.selected.length + offerManage.selection.accepted.length > 0) {
              this.firstStepCompletion = false;
              this.firstStepOkay = true;
            } else {
              this.firstStepCompletion = false;
              this.firstStepOkay = false;
            }

            if (this.firstStepCompletion && this.stepper.selectedIndex < 1) {
              this.stepper.next();
            }

            // Second stepper step control
            if (offerManage.selection.accepted.length >= this.offer.maxApplicants) {
              this.secondStepCompletion = true;
              this.secondStepOkay = true;
            } else if (offerManage.selection.accepted.length > 0) {
              this.secondStepCompletion = false;
              this.secondStepOkay = true;
            } else {
              this.secondStepCompletion = false;
              this.secondStepOkay = false;
            }

            if (this.secondStepCompletion && this.stepper.selectedIndex < 2) {
              this.stepper.next();
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
    window.scrollTo(0, 0);
  }

  isMobile() {
    return !this.media.isMatched('screen and (min-width: 960px)'); // gt-sm
  }

  applyFilters() {
    this.drawer.toggle();
    window.scrollTo(0, 0);
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
    this.router.navigate(['my-offers/4']);
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
            refreshStatus: -1
          }));
      }
    } else {
      if (candidate.applicationStatus !== 0) {
        this.store$.dispatch(new OfferManageActions
          .TryChangeApplicationStatus({
            candidateId: candidate.id,
            applicationId: candidate.applicationId,
            status: 0,
            refresh: true,
            refreshStatus: -1
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
            refresh: true,
            refreshStatus: -1
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

  getSelection(selection: any) {
    let selectTot = 0;
    if (selection.selected) {
      selectTot += selection.selected.lenght;
    }
    if (selection.accepted) {
      selectTot += selection.accepted.length;
    }
    return selectTot;
  }
}
