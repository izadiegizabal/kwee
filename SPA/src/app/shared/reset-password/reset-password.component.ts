import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Action, Store} from '@ngrx/store';
import {MatDialog, MatStepper} from '@angular/material';
import {filter} from 'rxjs/operators';
import {DialogErrorComponent} from '../../auth/signup/dialog-error/dialog-error.component';
import * as AuthActions from '../../auth/store/auth.actions';
import * as fromApp from '../../auth/store/auth.reducers';
import {AuthEffects} from '../../auth/store/auth.effects';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {

    onlyFormGroup: FormGroup;

    hide = false;

    private dialogShown = false;


    constructor(private _formBuilder: FormBuilder,
                public dialog: MatDialog,
                // private store$: Store<fromApp.AppState>,
                // private authEffects$: AuthEffects
                ) {}

    ngOnInit() {

      this.onlyFormGroup = this._formBuilder.group({
        'password': new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z0-9_-ñ]{6,49}$')]),
        'password2': new FormControl(null, Validators.required),
      });

      this.onlyFormGroup.controls['password2'].setValidators([
        Validators.required,
        this.samePassword.bind(this.onlyFormGroup),
      ]);


      this.onlyFormGroup.controls['password'].valueChanges.subscribe(value => {
        if (this.onlyFormGroup.controls['password'].value != null && this.onlyFormGroup.controls['password2'].value != null) {
          this.onlyFormGroup.controls['password2'].updateValueAndValidity();
        }
      });

    }


    samePassword(control: FormControl): { [s: string]: boolean } {

      const onlyFormGroup: any = this;
      if (control.value !== onlyFormGroup.controls['password'].value) {
        return {same: true};
      }
      return null;
    }

    onSave(stepper: MatStepper) {
      // this.store$.dispatch(new AdminActions.TryUpdateCandidate({id: id, updatedUser: this.updateuser}));
      // hacer update
    }
  }
