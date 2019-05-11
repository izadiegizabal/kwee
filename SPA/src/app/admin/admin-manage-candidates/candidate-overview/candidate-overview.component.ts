import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as fromAdmin from '../../store/admin.reducers';
import * as AdminActions from '../../store/admin.actions';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {AdminEffects} from '../../store/admin.effects';
import {MatDialog, PageEvent} from '@angular/material';
import {isStringNotANumber} from '../../../../models/Offer.model';
import {CandidateAccountStatus} from '../../../../models/Candidate.model';
import {AlertDialogComponent} from '../../../shared/alert-dialog/alert-dialog.component';
import {UserLogComponent} from '../../user-log/user-log.component';

@Component({
  selector: 'app-candidate-overview',
  templateUrl: './candidate-overview.component.html',
  styleUrls: ['./candidate-overview.component.scss']
})
export class CandidateOverviewComponent implements OnInit {

  // paging
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  // -----

  isInEditMode = false;
  isPanelOpen = false;
  updateuser: any;

  dialogError = false;

  adminState: Observable<fromAdmin.State>;
  query: any;
  orderby = '0';

  states = Object
    .keys(CandidateAccountStatus)
    .filter(isStringNotANumber)
    .map(key => ({value: CandidateAccountStatus[key], viewValue: key}));
  subscriptions: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Free'},
    {value: 1, viewValue: 'Premium'},
  ];

  userForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private store$: Store<fromApp.AppState>, private adminEffects$: AdminEffects,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.store$.dispatch(new AdminActions.TryGetCandidates({page: 1, limit: this.pageSize, params: this.query, order: this.orderby}));
    this.adminState = this.store$.pipe(select(state => state.admin));

    this.userForm = this._formBuilder.group({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
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


  samePassword(control: FormControl): { [s: string]: boolean } {
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
    this.userForm.controls['accountState'].setValue(user.status);
    this.userForm.controls['premium'].setValue(user.premium);
  }

  callAlertDialogUpdate(id) {
    const dialogDelete = this.dialog.open(AlertDialogComponent, {
      data: {
        header: 'Are you sure you want to update this user?',
      }
    });

    dialogDelete.afterClosed().subscribe(result => {
      if (result) {
        this.updateApplicant(id);
      }
    });
  }

  updateApplicant(id) {
    if (this.userForm.status === 'VALID' && id) {
      this.isInEditMode = false;
      this.isPanelOpen = false;

      this.updateuser = {
        'name': this.userForm.controls['name'].value,
        'email': this.userForm.controls['email'].value,
        'status': this.userForm.controls['accountState'].value,
        'premium': this.userForm.controls['premium'].value,
      };

      if (this.userForm.controls['password'].value !== null && this.userForm.controls['password'].value !== '') {
        this.updateuser['password'] = this.userForm.controls['password'].value;
      }

      this.store$.dispatch(new AdminActions.TryUpdateCandidate({id: id, updatedCandidate: this.updateuser}));
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
        this.deleteApplicant(id);
      }
    });
  }

  deleteApplicant(id) {
    this.store$.dispatch(new AdminActions.TryDeleteCandidate(id));
    this.adminEffects$.adminDeleteCandidate.pipe(
      filter((action: Action) => action.type === AdminActions.OPERATION_ERROR)
    ).subscribe((error: { payload: any, type: string }) => {
      console.log(error.payload);
      // this.dialogError = true;
    });

    // if (!this.dialogError) {
    //   // mensaje de OK
    //   this.dialogError = false;
    // }
  }

  changepage() {
    this.store$.dispatch(new AdminActions.TryGetCandidates(
      {page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize, params: this.query, order: this.orderby}));
  }

  openLogModal(id) {
    this.dialog.open(UserLogComponent, {
      data: {
        id
      }
    });
  }

}
