import {Component, Input, OnInit} from '@angular/core';
import {getTimePassed, getUrlfiedString} from '../../shared/utils.service';
import {MatDialog} from '@angular/material';
import {SnsShareDialogComponent} from '../../shared/sns-share/sns-share-dialog/sns-share-dialog.component';
import {ContractType, JobDurationUnit, SalaryFrequency, WorkLocationType} from '../../../models/Offer.model';
import {environment} from '../../../environments/environment';
import {RateCandidateComponent} from '../../rating/rate-candidate/rate-candidate.component';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import {AlertDialogComponent} from '../../shared/alert-dialog/alert-dialog.component';
import {OfferManageEffects} from '../offer-manage/store/offer-manage.effects';
import * as OfferManageActions from '../offer-manage/store/offer-manage.actions';
import {filter} from 'rxjs/operators';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-offer-preview-card',
  templateUrl: './offer-preview-card.component.html',
  styleUrls: ['./offer-preview-card.component.scss']
})
export class OfferPreviewCardComponent implements OnInit {

  offerUrl: string;
  authState: any;
  offerManageState: any;
  candidate: boolean;
  nameToRate: string;
  userId: number;

  @Input() offer: any;
  currencies;


  constructor(public dialog: MatDialog,
              private store$: Store<fromApp.AppState>,
              private router: Router,
              private http: HttpClient,
              private manageOfferEffects: OfferManageEffects) {
  }

  ngOnInit() {

    this.http.get('../../../assets/CurrenciesISO.json').subscribe(currencies => {
        this.currencies = currencies;
      }
    );

    // console.log(this.offer);

    this.offerUrl = this.urlfyPosition();

    this.authState = this.store$.pipe(select('auth'));
    this.authState.pipe(
      select((s: { user: any }) => s.user)
    ).subscribe(
      (user) => {
        // console.log(user);
        if (user) {
          this.candidate = user.type === 'candidate';
          if (this.candidate) {
            this.nameToRate = this.offer.offererName;
            this.userId = user.id;
          }
        }
      });

    this.manageOfferEffects.ChangeOfferStatus.pipe(
      filter((action: any) => action.type === OfferManageActions.SET_CHANGE_OFFER_STATUS)
    ).subscribe((next: { payload: any, type: string }) => {
        if (!this.candidate) {
          this.router.navigate(['/my-offers/' + this.offer.id + '/selection']);
        }
      }
    );
  }

  urlfyPosition() {
    return '/offer/' + this.offer.id + '/' + getUrlfiedString(this.offer.title);
  }


  getPublishedDate() {
    if (this.offer && this.offer.datePublished) {
      return getTimePassed(new Date(this.offer.datePublished));
    }
  }

  openShareDialog() {
    this.dialog.open(SnsShareDialogComponent, {
      data: {
        offer: {title: this.offer.title, url: location.hostname + this.urlfyPosition()}
      }
    });
  }

  getOfferSalary() {
    let salaryNum;
    if (this.offer.salaryAmount > 10000) {
      salaryNum = (Number(this.offer.salaryAmount) / 1000).toFixed(1) + 'K';
    } else {
      salaryNum = this.offer.salaryAmount;
    }

    return salaryNum +
      this.getCurrency(this.offer.salaryCurrency) + ' ' +
      SalaryFrequency[this.offer.salaryFrequency];
  }

  private getCurrency(salaryCurrency) {
    let currency = '';
    if (this.currencies) {
      Object.keys(this.currencies).map(key => {
        if (this.currencies[key].value && this.currencies[key].value === salaryCurrency) {
          currency = this.currencies[key].symbol;
        }
      });
    }
    return currency;
  }

  getOfferDuration() {
    if (this.offer.isIndefinite) {
      return 'Indefinite';
    } else {
      if (this.offer.duration > 1) {
        return this.offer.duration + ' ' + JobDurationUnit[this.offer.durationUnit];
      } else {
        return this.offer.duration + ' ' + JobDurationUnit[this.offer.durationUnit].slice(0, -1);
      }
    }
  }

  getOfferContractType() {
    return ContractType[this.offer.contractType];
  }

  getOfferLocation() {
    let location = this.offer.location ? this.offer.location : '';
    if (location !== '' && this.offer.workLocation !== WorkLocationType['On Site']) {
      location += ' - ';
      location += WorkLocationType[this.offer.workLocation];
    } else if (location === '') {
      location = WorkLocationType[this.offer.workLocation];
    }

    return location;
  }

  urlOfferer() {
    const url = '/business/' + this.offer.fk_offerer + '/' + getUrlfiedString(this.offer.offererName);
    return url;
  }

  getImg() {
    return this.offer.img ? environment.apiUrl + 'image/offerers/' + this.offer.img :
      'https://cdn.vox-cdn.com/thumbor/Pkmq1nm3skO0-j693JTMd7RL0Zk=/0x0:2012x1341/1200x800/filters:focal(0x0:2012x1341)/' +
      'cdn.vox-cdn.com/uploads/chorus_image/image/47070706/google2.0.0.jpg';
  }

  rate() {
    if (this.offer.status === 1) {
      const applications: any[] = [];
      if (!this.candidate) {
        this.offer.applications.forEach((e) => {
          if (e.applicationStatus === 3) {
            applications.push({
              to: e.applicationId,
              name: e.applicantName,
              index: e.applicantStatus,
              haveIRated: e.aHasRated
            });
          }
        });
      } else {
        applications.push({to: this.offer.fk_application, name: this.nameToRate, haveIRated: this.offer.aHasRated});
      }
      const dialogRef = this.dialog.open(RateCandidateComponent, {
        width: '95%',
        maxHeight: '90%',
        data: {candidate: !this.candidate, applications: applications}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result) {
          console.log(result);
        }
      });
    }
  }

  reject() {

    const dialog = this.dialog.open(AlertDialogComponent, {
      data: {
        header: 'Are you sure you want to reject this offer?',
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.changeApplicationStatus(4);
      }
    });
  }

  accept() {

    const dialog = this.dialog.open(AlertDialogComponent, {
      data: {
        header: 'Are you sure you want to accept this offer?',
      }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.changeApplicationStatus(3);
      }
    });
  }

  changeApplicationStatus(status: number) {
    this.store$.dispatch(new OfferManageActions
      .TryChangeApplicationStatus({
        candidateId: this.userId,
        applicationId: this.offer.fk_application,
        status: status,
        refresh: false,
        refreshStatus: this.offer.status
      }));

  }

  startSelectionProcess() {
    this.store$.dispatch(new OfferManageActions.TryChangeOfferStatus({offerId: this.offer.id, newStatus: 3}));
  }

  getDescription() {
    if (this.offer.description && this.offer.description.length > 300) {
      return this.offer.description.substring(0, 300) + '...';
    } else {
      return this.offer.description;
    }
  }
}
