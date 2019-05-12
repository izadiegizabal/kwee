import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import {AuthEffects} from '../store/auth.effects';
import * as AuthActions from '../store/auth.actions';
import {filter, take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import * as fromAuth from '../store/auth.reducers';
import {MatDialog} from '@angular/material';
import {ResetDialogComponent} from './reset-dialog/reset-dialog.component';
import {Title} from '@angular/platform-browser';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss',
    '../signup/signup-candidate/signup-candidate.component.scss']
})
export class SigninComponent implements OnInit {
  user: FormGroup;
  hide = false;
  authState: Observable<fromAuth.State>;

  constructor(
    private titleService: Title,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private store$: Store<fromApp.AppState>, private authEffects$: AuthEffects,
    public router: Router,
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Sign In');
    this.user = this._formBuilder.group({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required),
    });

    this.authState = this.store$.pipe(select('auth'));
    this.authEffects$.authSignin.pipe(
      filter((action: Action) => action.type === AuthActions.AUTH_ERROR)
    ).subscribe((error: { payload: any, type: string }) => {
      console.log(error.payload);
      this.user.controls['email'].setErrors({'incorrect': true});
      this.user.controls['password'].setErrors({'incorrect': true});
    });
    this.authEffects$.authSignin.pipe(
      filter((action: Action) => action.type === AuthActions.SET_USER),
      take(1)
    ).subscribe((res: {
        payload: {
          root: boolean,
          email: string,
          type: string,
        },
        type: string
      }) => {
        if (res.payload.root) {
          this.router.navigate(['/admin']);
        } else if (res.payload.type === 'candidate') {
          this.router.navigate(['/candidate-home']);
        } else if (res.payload.type === 'business') {
          this.router.navigate(['/my-offers']);
        } else {
          this.router.navigate(['/']);
        }
      }
    );
  }

  signIn() {
    this.store$.dispatch(new AuthActions.TrySignin(this.user.value));
  }

  openResetModal() {
    this.dialog.open(ResetDialogComponent, {
      data: {
        email: this.user.controls['email'].value,
      }
    });
  }
}
