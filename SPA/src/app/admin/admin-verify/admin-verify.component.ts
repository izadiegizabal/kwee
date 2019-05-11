import {Component, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material';
import * as AdminActions from '../store/admin.actions';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import {Observable} from 'rxjs';
import * as fromAdmin from '../store/admin.reducers';
import {BusinessAccountStates, BusinessAccountSubscriptions, BusinessIndustries} from '../../../models/Business.model';
import {isStringNotANumber} from '../../../models/Offer.model';
import {Title} from '@angular/platform-browser';


@Component({
  selector: 'app-admin-verify',
  templateUrl: './admin-verify.component.html',
  styleUrls: ['./admin-verify.component.scss']
})
export class AdminVerifyComponent implements OnInit {

  // paging
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  // ---------

  isPanelOpen = false;
  orderby = '0';
  query: any;


  workFields = Object
    .keys(BusinessIndustries)
    .filter(isStringNotANumber)
    .map(key => ({value: BusinessIndustries[key], viewValue: key}));
  states = Object
    .keys(BusinessAccountStates)
    .filter(isStringNotANumber)
    .map(key => ({value: BusinessAccountStates[key], viewValue: key}));
  subscriptions = Object
    .keys(BusinessAccountSubscriptions)
    .filter(isStringNotANumber)
    .map(key => ({value: BusinessAccountSubscriptions[key], viewValue: key}));

  adminState: Observable<fromAdmin.State>;


  constructor(private store$: Store<fromApp.AppState>, private titleService: Title) {
  }

  ngOnInit() {

    this.query = {...this.query, status: '1'};

    this.titleService.setTitle('Kwee - ' + 'Verify Businesses');
    this.store$.dispatch(new AdminActions.TryGetBusinesses({page: 1, limit: this.pageSize, params: this.query, order: this.orderby}));
    this.adminState = this.store$.pipe(select(s => s.admin));
  }

  getWorkField(workField: number) {
    return this.workFields.find(o => o.value === workField).viewValue;
  }

  changepage() {
    this.store$.dispatch(new AdminActions.TryGetBusinesses(
      {page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize, params: '', order: this.orderby}));
  }

  accept(user) {
    const updateuser = {
      'name': user.name,
      'status': 0,
    };
    this.store$.dispatch(new AdminActions.TryUpdateBusiness({id: user.id, updatedBusiness: updateuser}));
  }

  deny(user) {
    const updateuser = {
      'name': user.name,
      'status': 3,
    };
    this.store$.dispatch(new AdminActions.TryUpdateBusiness({id: user.id, updatedBusiness: updateuser}));
  }

}
