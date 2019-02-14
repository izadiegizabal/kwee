import {Component, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material';
import * as AdminActions from '../store/admin.actions';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import {Observable} from 'rxjs';
import * as fromAdmin from '../store/admin.reducers';


@Component({
  selector: 'app-admin-verify',
  templateUrl: './admin-verify.component.html',
  styleUrls: ['./admin-verify.component.scss']
})
export class AdminVerifyComponent implements OnInit {

  // paging
  pageSize = 2;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  // ---------

  isPanelOpen = false;


  workFields: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Software Engineering'},
    {value: 1, viewValue: 'Engineering Management'},
    {value: 2, viewValue: 'Design'},
    {value: 3, viewValue: 'Data Analytics'},
    {value: 4, viewValue: 'Developer Operations'},
    {value: 5, viewValue: 'Quality Assurance'},
    {value: 6, viewValue: 'Information Technology'},
    {value: 7, viewValue: 'Project Management'},
    {value: 9, viewValue: 'Product Management'},
  ];
  states: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Active'},
    {value: 1, viewValue: 'Verification Pending'},
    {value: 2, viewValue: 'Validation Pending'},
    {value: 3, viewValue: 'Blocked'},
  ];
  subscriptions: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Free / Pay-as-you-go'},
    {value: 1, viewValue: 'Premium'},
    {value: 2, viewValue: 'Elite'},
  ];

  adminState: Observable<fromAdmin.State>;


  constructor(private store$: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.store$.dispatch(new AdminActions.TryGetBusinesses({page: 1, limit: 2}));
    this.adminState = this.store$.pipe(select(s => s.admin));
  }

  getWorkField(workField: number) {
    return this.workFields.find(o => o.value === workField).viewValue;
  }

  changepage() {
    this.store$.dispatch(new AdminActions.TryGetBusinesses({page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize}));
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
