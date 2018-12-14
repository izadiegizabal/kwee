import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Action, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import {AuthEffects} from '../store/auth.effects';
import * as AuthActions from '../store/auth.actions';
import {filter} from 'rxjs/operators';
import {Router} from '@angular/router';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss',
    '../signup/signup-candidate/signup-candidate.component.scss']
})
export class SigninComponent implements OnInit {
  user: FormGroup;
  hide = false;

  constructor(private _formBuilder: FormBuilder,
              private store: Store<fromApp.AppState>, private authEffects: AuthEffects,
              private router: Router) {
  }

  ngOnInit() {
    this.user = this._formBuilder.group({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required),
    });
  }

  signIn() {
    this.store.dispatch(new AuthActions.TrySignin(this.user.value));
    this.authEffects.authSignin.pipe(
      filter((action: Action) => action.type === AuthActions.AUTH_ERROR)
    ).subscribe((error: {payload: any, type: string}) => {
      console.log(error.payload);
      this.user.controls['email'].setErrors({'incorrect': true});
      this.user.controls['password'].setErrors({'incorrect': true});
    });
    this.authEffects.authSignin.pipe(
      filter((action: Action) => action.type === AuthActions.SIGNIN)
    ).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

}
