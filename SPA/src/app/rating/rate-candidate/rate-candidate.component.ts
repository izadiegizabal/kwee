import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';

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
      two: new FormControl('', Validators.required),
      three: new FormControl('', Validators.required),
      four: new FormControl('', Validators.required),
      five: new FormControl('', Validators.required),
      six: new FormControl('', Validators.required)
    });

    this.selected = this.data.list[0].name;

    /*
      efficiency: new FormControl('', Validators.required),
      punctuality: new FormControl('', Validators.required),
      skills: new FormControl('', Validators.required),
      hygiene: new FormControl('', Validators.required),
      teamwork: new FormControl('', Validators.required),
      overall: new FormControl('', Validators.required)
     */

    console.log(this.data);


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
      document.getElementById('required').style.color = 'red';
    }
  }

}
