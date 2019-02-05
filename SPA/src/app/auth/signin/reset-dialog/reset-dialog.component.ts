import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

export interface DialogData {
  email: string;
}

@Component({
  selector: 'app-reset-dialog',
  templateUrl: './reset-dialog.component.html',
  styleUrls: ['./reset-dialog.component.scss']
})
export class ResetDialogComponent implements OnInit {
  formGroup: FormGroup;
  reset = undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'email': new FormControl(this.data.email, [Validators.required, Validators.email]),
    });
  }

  resetPassword() {
    const emailToReset = this.formGroup.controls['email'].value;
    const body = JSON.stringify({email: emailToReset});
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.httpClient.post(environment.apiUrl + 'forgot', body, {headers: headers}).subscribe(
      res => this.reset = true,
      err => this.reset = false,
    );
  }
}
