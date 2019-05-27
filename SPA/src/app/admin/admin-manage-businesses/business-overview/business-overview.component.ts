import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as AdminActions from '../../store/admin.actions';
import {Observable} from 'rxjs';
import * as fromAdmin from '../../store/admin.reducers';
import {filter} from 'rxjs/operators';
import {AdminEffects} from '../../store/admin.effects';
import {MatDialog, MatPaginator, PageEvent} from '@angular/material';
import {BusinessAccountStates, BusinessAccountSubscriptions, BusinessIndustries} from '../../../../models/Business.model';
import {isStringNotANumber} from '../../../../models/Offer.model';
import {AlertDialogComponent} from '../../../shared/alert-dialog/alert-dialog.component';
import {UserLogComponent} from '../../user-log/user-log.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-business-overview',
  templateUrl: './business-overview.component.html',
  styleUrls: ['./business-overview.component.scss']
})
export class BusinessOverviewComponent implements OnInit, AfterViewInit {

  // paging
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  // ---------

  isPanelOpen = false;
  isInEditMode = false;
  updateuser: any;
  query: any;
  orderby = '0';
  nPage = 1;
  @ViewChild('paginator') paginator: MatPaginator;


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

  userForm: FormGroup;

  adminState: Observable<fromAdmin.State>;

  constructor(
    private _formBuilder: FormBuilder,
    private store$: Store<fromApp.AppState>, private adminEffects$: AdminEffects,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params['page']) {
          this.nPage = params['page'];
        }
        if (params['limit']) {
          this.pageSize = params['limit'];
        }
      });

    this.store$.dispatch(new AdminActions.TryGetBusinesses({
      page: this.nPage,
      limit: this.pageSize,
      params: this.query,
      order: this.orderby
    }));

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

  ngAfterViewInit() {
    setTimeout(() => {
      const index = this.nPage;
      if (this.paginator) {
        this.paginator.pageIndex = index - 1;
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

  callAlertDialogUpdate(id) {
    const dialogDelete = this.dialog.open(AlertDialogComponent, {
      data: {
        header: 'Are you sure you want to update this user?',
      }
    });

    dialogDelete.afterClosed().subscribe(result => {
      if (result) {
        this.updateOfferer(id);
      }
    });
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
      this.store$.dispatch(new AdminActions.TryUpdateBusiness({id: id, updatedBusiness: this.updateuser}));
    } else {
      console.log(this.userForm);
    }
  }


  callAlertDialogDelete(id) {
    const dialogDelete = this.dialog.open(AlertDialogComponent, {
      data: {
        header: 'Are you sure you want to delete this user?',
      }
    });

    dialogDelete.afterClosed().subscribe(result => {
      if (result) {
        this.deleteOfferer(id);
      }
    });
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
    this.store$.dispatch(new AdminActions.TryGetBusinesses(
      {page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize, params: this.query, order: this.orderby}));
    window.scrollTo(0, 0);
    this.nPage = this.pageEvent.pageIndex + 1;
    if (this.pageSize !== this.pageEvent.pageSize) {
      this.pageSize = this.pageEvent.pageSize;
    }
    this.router.navigate(['/admin/manage-businesses'],
      {queryParams: {page: this.nPage, limit: this.pageSize}, queryParamsHandling: 'merge'});
  }

  openLogModal(id) {
    this.dialog.open(UserLogComponent, {
      data: {
        id
      }
    });
  }
}
