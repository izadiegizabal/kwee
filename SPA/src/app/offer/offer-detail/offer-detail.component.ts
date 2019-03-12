import {Component, OnInit} from '@angular/core';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as OfferActions from './store/offer.actions';
import * as fromOffer from './store/offer.reducers';
import {Observable} from 'rxjs';
import {OfferEffects} from './store/offer.effects';
import {filter} from 'rxjs/operators';
import {Location} from '@angular/common';

import {ContractType, JobDurationUnit, OfferStatus, SalaryFrequency, SeniorityLevel, WorkLocationType} from '../../../models/Offer.model';
import {getTimePassed, getUrlfiedString} from '../../shared/utils.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.scss']
})
export class OfferDetailComponent implements OnInit {
  offerSkills: [' '];
  offerState: Observable<fromOffer.State>;
  authState: any;
  id: any;
  offerId: Number;

  constructor(private store$: Store<fromApp.AppState>,
              private activatedRoute: ActivatedRoute,
              private offerEffects$: OfferEffects,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    this.authState = this.store$.pipe(select('auth'));
    this.authState.pipe(
      select((s: { user: { id: Number } }) => s.user ? s.user.id : undefined)
    ).subscribe(
      (id) => {
        this.id = id ? id : null;
      });

    const params = this.activatedRoute.snapshot.params;

    if (Number(params.id)) {
      this.offerId = Number(params.id);
      this.store$.dispatch(new OfferActions.TryGetOffer({id: params.id}));
      this.offerState = this.store$.pipe(select(state => state.offer));

      this.offerEffects$.offerGetoffer.pipe(
        filter((action: Action) => action.type === OfferActions.OPERATION_ERROR)
      ).subscribe((error: { payload: any, type: string }) => {
        this.router.navigate(['/']);
      });
    } else {
      this.router.navigate(['/']);
    }

  }

  getTimePassed(publishDate) {
    return getTimePassed(new Date(publishDate));
  }

  getOfferStatus(status) {
    return OfferStatus[status];
  }

  getOfferDuration(isIndefinite, duration, durationUnit) {
    if (isIndefinite) {
      return 'Indefinite';
    } else {
      if (duration > 1) {
        return duration + ' ' + JobDurationUnit[durationUnit];
      } else {
        return duration + ' ' + JobDurationUnit[durationUnit].slice(0, -1);
      }
    }
  }

  getOfferContractType(contractType) {
    return ContractType[contractType];
  }

  getOfferSeniorityLevel(seniority) {
    return SeniorityLevel[seniority] + ' Position';
  }

  getOfferSalary(salaryAmount, salaryCurrency, salaryFrequency) {
    return salaryAmount + salaryCurrency + ' ' + SalaryFrequency[salaryFrequency];
  }

  getOfferLocation(offerlocation, workLocation) {
    let location = offerlocation ? offerlocation : '';
    if (location !== '' && workLocation !== WorkLocationType['On Site']) {
      location += ' - ';
      location += WorkLocationType[workLocation];
    } else if (location === '') {
      location = WorkLocationType[workLocation];
    }

    return location;
  }

  getOfferApplications(applications) {
    const numOfApplications = applications;
    return numOfApplications + (numOfApplications === 1 ? ' application' : ' applications');
  }

  getShareableOffer(title) {
    return {title: title, url: window.location.href};
  }

  getSkills(skills) {
    this.offerSkills = skills.split([',']);
    return this.offerSkills;
  }

  postApplication() {
    const params = this.activatedRoute.snapshot.params;
    this.store$.dispatch(new OfferActions.TryPostApplication({fk_offer: params.id}));
  }

  urlOfferer(id, name) {
    const url = '/business/' + id + '/' + getUrlfiedString(name);
    return url;
  }

  goEdit() {
    this.router.navigate(['/offer', this.offerId, 'edit']);
  }

  backClicked() {
    this.location.back();
  }



}
