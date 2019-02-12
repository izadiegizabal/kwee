import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as AdminActions from '../../store/admin.actions';
import {Observable} from 'rxjs';
import * as fromAdmin from '../../store/admin.reducers';
import {filter} from 'rxjs/operators';
import {AdminEffects} from '../../store/admin.effects';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-business-overview',
  templateUrl: './business-overview.component.html',
  styleUrls: ['./business-overview.component.scss']
})
export class BusinessOverviewComponent implements OnInit {

  // paging
  pageSize = 2;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  // ---------

  isPanelOpen = false;
  isInEditMode = false;
  updateuser: any;

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

  userForm: FormGroup;

  adminState: Observable<fromAdmin.State>;

  constructor(
    private _formBuilder: FormBuilder,
    private store$: Store<fromApp.AppState>, private adminEffects$: AdminEffects) {
  }

  ngOnInit() {
    this.store$.dispatch(new AdminActions.TryGetBusinesses({page: 1, limit: 2}));
    this.adminState = this.store$.pipe(select(s => s.admin));

    this.userForm = this._formBuilder.group({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'vat': new FormControl(null, Validators.required),
      'workField': new FormControl(0, Validators.required),
      'password': new FormControl('', Validators.pattern('[a-zA-Z0-9_-ñ]{6,49}$')),
      'password2': new FormControl(''),
      'accountState': new FormControl(0, Validators.required),
      'premium': new FormControl(0, Validators.required),
    });

    this.userForm.controls['password2'].setValidators([
      this.samePassword.bind(this.userForm),
    ]);

    this.userForm.controls['password'].valueChanges.subscribe(() => {
      if (this.userForm.controls['password'].value !== null) {
        this.userForm.controls['password2'].updateValueAndValidity();
      }
    });
  }

  samePassword(control: FormControl) {
    const userForm: any = this;
    if (control.value !== userForm.controls['password'].value) {
      return {different: true};
    }
    return null;
  }

  edit(user) {
    this.isInEditMode = true;
    this.userForm.controls['name'].setValue(user.name);
    this.userForm.controls['email'].setValue(user.email);
    this.userForm.controls['vat'].setValue(user.cif);
    this.userForm.controls['accountState'].setValue(user.status);
    this.userForm.controls['premium'].setValue(user.premium);
    this.userForm.controls['workField'].setValue(user.workField);
  }

  getWorkField(workField: number) {
    return this.workFields.find(o => o.value === workField).viewValue;
  }

  updateOfferer(id) {

    if (this.userForm.status === 'VALID') {
      this.isInEditMode = false;
      this.isPanelOpen = false;

      this.updateuser = {
        'name': this.userForm.controls['name'].value,
        'email': this.userForm.controls['email'].value,
        'cif': this.userForm.controls['vat'].value,
        'workField': this.userForm.controls['workField'].value,
        'status': this.userForm.controls['accountState'].value,
        'premium': this.userForm.controls['premium'].value,
      };

      if (this.userForm.controls['password'].value !== null && this.userForm.controls['password'].value !== '') {
        this.updateuser['password'] = this.userForm.controls['password'].value;
      }

      // console.log(this.updateuser);

      this.store$.dispatch(new AdminActions.TryUpdateBusiness({id: id, updatedBusiness: this.updateuser}));
    } else {
      console.log(this.userForm);
    }
  }


  deleteOfferer(id) {
    this.store$.dispatch(new AdminActions.TryDeleteBusiness(id));
    this.adminEffects$.adminDeleteBusiness.pipe(
      filter((action: Action) => action.type === AdminActions.OPERATION_ERROR)
    ).subscribe((error: { payload: any, type: string }) => {
      console.log(error.payload);
    });
  }

  changepage() {
    this.store$.dispatch(new AdminActions.TryGetBusinesses({page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize}));
    this.adminState = this.store$.pipe(select(s => s.admin));
  }
}
