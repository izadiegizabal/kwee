import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as AuthActions from '../store/auth.actions';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss',
    '../signup/signup-candidate/signup-candidate.component.scss']
})
export class SigninComponent implements OnInit {
  user: FormGroup;
  hide = false;

  constructor(private _formBuilder: FormBuilder, private store: Store<fromApp.AppState>, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.user = this._formBuilder.group({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required),
    });
  }

  signIn() {
    this.store.dispatch(new AuthActions.TrySignin(this.user.value));
    // this.authService.signIn(this.user.value)
    //   .subscribe(
    //     (response) => {
    //       this.router.navigate(['/']);
    //       // TODO: save token, meanwhile console it
    //       console.log(response);
    //     },
    //     (error) => {
    //       this.user.controls['email'].setErrors({'incorrect': true});
    //       this.user.controls['password'].setErrors({'incorrect': true});
    //     }
    //   )
    // ;
  }

}
