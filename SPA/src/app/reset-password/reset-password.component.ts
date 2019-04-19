import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {select, Store} from '@ngrx/store';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducers';
import {Observable} from 'rxjs';
import * as fromAuth from '../auth/store/auth.reducers';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {
  @ViewChild('message') message;

  onlyFormGroup: FormGroup;
  token: String;

  isOkay = 0;
  private errorMsg: string;
  authState: Observable<fromAuth.State>;


  // 0 = nothing done, 1 = changed correctly, 2 = error while changing password

  constructor(
    private titleService: Title,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private store$: Store<fromApp.AppState>,
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Reset Password');

    this.onlyFormGroup = new FormGroup({
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

    this.token = this.activatedRoute.snapshot.params.token;

  }


  samePassword(control: FormControl): { [s: string]: boolean } {

    const onlyFormGroup: any = this;
    if (control.value !== onlyFormGroup.controls['password'].value) {
      return {same: true};
    }
    return null;
  }

  onSave() {
    if (this.token && this.onlyFormGroup.valid) {
      const newPassword = this.onlyFormGroup.controls['password'].value;
      const body = JSON.stringify(
        {
          token: this.token,
          password: newPassword
        });


      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post(environment.apiUrl + 'reset', body, {headers: headers}).subscribe(
        (res: {
          message: string,
          ok: boolean
        }) => {
          console.log(res);
          this.showResult(res.ok, res.message);

          // sign in with token
          this.signIn();
        },
        (err) => {
          console.log(err);
          this.showResult(err.ok, err.message);
        },
      );
    } else {
      this.onlyFormGroup.markAsTouched();
    }

  }

  private showResult(ok: boolean, message: string) {
    if (!ok) {
      this.isOkay = 2;
      this.errorMsg = message;
    } else {
      this.isOkay = 1;
    }

  }

  signIn() {
    this.authState = this.store$.pipe(select('auth'));
    this.store$.dispatch(new AuthActions.TrySignin(
      {email: null, password: this.onlyFormGroup.controls['password'].value, token: this.token}));
  }
}
