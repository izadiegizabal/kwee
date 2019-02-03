import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ActivatedRoute} from '@angular/router';

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

  // 0 = nothing done, 1 = changed correctly, 2 = error while changing password

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {

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
}
