import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import {ChangeEvent} from '@ckeditor/ckeditor5-angular/ckeditor.component';

export interface DialogData {
  candidate: boolean;
  to: number;
  list: any;
}

@Component({
  selector: 'app-rate-candidate',
  templateUrl: './rate-candidate.component.html',
  styleUrls: ['./rate-candidate.component.scss']
})
export class RateCandidateComponent implements OnInit {

  form: FormGroup;
  selected: string;
  authState: any;
  token: string;

  constructor(
    private http: HttpClient,
    private store$: Store<fromApp.AppState>,
    public dialogRef: MatDialogRef<RateCandidateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit() {
    this.authState = this.store$.pipe(select('auth'));
    this.authState.pipe(
      select((s: { token: string }) => s.token)
    ).subscribe(
      (token) => {
        this.token = token;
      });

    this.form = new FormGroup({
      opinion: new FormControl(null),
      one: new FormControl('', Validators.required),
      one_aux: new FormControl(null, Validators.required),
      two: new FormControl('', Validators.required),
      two_aux: new FormControl(null, Validators.required),
      three: new FormControl('', Validators.required),
      three_aux: new FormControl(null, Validators.required),
      four: new FormControl('', Validators.required),
      four_aux: new FormControl(null, Validators.required),
      five: new FormControl('', Validators.required),
      five_aux: new FormControl(null, Validators.required),
      six: new FormControl('', Validators.required),
      six_aux: new FormControl(null, Validators.required)
    });

    this.selected = this.data.list[0].name;

    this.form.controls['one'].valueChanges.subscribe(value => {
      this.form.controls['one_aux']. setValue(value);
    });

    this.form.controls['two'].valueChanges.subscribe(value => {
      this.form.controls['two_aux']. setValue(value);
    });

    this.form.controls['three'].valueChanges.subscribe(value => {
      this.form.controls['three_aux']. setValue(value);
    });

    this.form.controls['four'].valueChanges.subscribe(value => {
      this.form.controls['four_aux']. setValue(value);
    });

    this.form.controls['five'].valueChanges.subscribe(value => {
      this.form.controls['five_aux']. setValue(value);
    });

    this.form.controls['six'].valueChanges.subscribe(value => {
      this.form.controls['six_aux']. setValue(value);
    });
  }

  rate() {
    if (this.form.valid) {
      const options = {
        headers: new HttpHeaders().append('token', this.token)
          .append('Content-Type', 'application/json')
      };

      let obj = {};
      let url = '';
      if (this.data.candidate) {
        url = 'rating_applicant';
        obj = {
          'fk_application': this.data.to,
          'opinion': this.form.controls['opinion'].value,
          'efficience': this.form.controls['one'].value,
          'skills': this.form.controls['three'].value,
          'puntuality': this.form.controls['two'].value,
          'hygiene': this.form.controls['four'].value,
          'teamwork': this.form.controls['five'].value,
          'satisfaction': this.form.controls['six'].value
        };
      } else {
        url = 'rating_offerer';
        obj = {
          'fk_application': this.data.to,
          'opinion': this.form.controls['opinion'].value,
          'installations': this.form.controls['one'].value,
          'environment': this.form.controls['two'].value,
          'salary': this.form.controls['three'].value,
          'partners': this.form.controls['four'].value,
          'services': this.form.controls['five'].value,
          'satisfaction': this.form.controls['six'].value
        };
      }

      this.http.post(environment.apiUrl + url,
        obj
        , options)
        .subscribe((data: any) => {
          console.log(data);
          this.dialogRef.close(this.form);
        }, (error: any) => {
          console.log(error);
          /*if (!this.dialogShown) {
            this.dialog.open(DialogErrorComponent, {
              data: {
                error: 'We had some issue creating your offer. Please try again later',
              }
            });
            this.dialogShown = true;
          }*/
        });

      // this.dialogRef.close(this.form);
    } else {
      for (const i of Object.keys(this.form.controls)) {
        this.form.controls[i].markAsTouched();
      }
    }
  }

}
