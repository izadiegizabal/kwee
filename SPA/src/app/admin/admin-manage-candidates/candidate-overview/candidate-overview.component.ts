import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../admin.service';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as fromAdmin from '../../store/admin.reducers';
import * as AdminActions from '../../store/admin.actions';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-candidate-overview',
  templateUrl: './candidate-overview.component.html',
  styleUrls: ['./candidate-overview.component.scss']
})
export class CandidateOverviewComponent implements OnInit {
  isInEditMode = false;
  isPanelOpen = false;
  updateuser: any;

  candidateState: Observable<fromAdmin.State>;

  states: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Active'},
    {value: 1, viewValue: 'Blocked'},
    {value: 2, viewValue: 'Verification Pending'},
  ];
  subscriptions: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Free'},
    {value: 1, viewValue: 'Premium'},
  ];

  userForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private store$: Store<fromApp.AppState>,
    private _adminService: AdminService) {
  }

  ngOnInit() {


    this.store$.dispatch(new AdminActions.TryGetCandidates());
    this.candidateState = this.store$.pipe(select(state => state.admin));

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

    this.userForm.controls['password'].valueChanges.subscribe(value => {
      if (this.userForm.controls['password'].value !== null && this.userForm.controls['password'].value !== '') {
        this.userForm.controls['password2'].updateValueAndValidity();
      }
    });
  }


  samePassword(control: FormControl): { [s: string]: boolean } {
    const userForm: any = this;
    if (control.value !== userForm.controls['password'].value) {
      return {same: true};
    }
    return null;
  }

  edit(user) {
    this.isInEditMode = true;
    this.userForm.controls['name'].setValue(user.name);
    this.userForm.controls['email'].setValue(user.email);
    // this.userForm.controls['accountState'].setValue(user.state);
    this.userForm.controls['premium'].setValue(user.premium);
  }


  updateApplicant(id) {

    if (this.userForm.status === 'VALID') {
      this.isInEditMode = false;
      this.isPanelOpen = !this.isPanelOpen;

      this.updateuser = {
        'name': this.userForm.controls['name'].value,
        'email': this.userForm.controls['email'].value,
        // 'status': this.userForm.controls['accountState'].value,
        'premium': this.userForm.controls['premium'].value,
      };

      if (this.userForm.controls['password'].value !== null && this.userForm.controls['password'].value !== '') {
        this.updateuser['password'] = this.userForm.controls['password'].value;
      }

      // console.log(this.updateuser);

      this._adminService.updateUser(0, id, this.updateuser)
        .subscribe(
          (res) => {
            console.log(res);
            this.ngOnInit();
          },
          (error) => {
            console.log(error);
            this.ngOnInit();
          }
        );
    } else {
      console.log(this.userForm);
    }
  }


  deleteApplicant(id) {
    this._adminService.deleteUser(0, id)
      .subscribe(
        (res) => {
          console.log(res);
          this.ngOnInit();
        },
        (error) => {
          console.log(error);
        }
      );
  }

}
