import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import {getColourFromIndex} from '../../shared/utils.service';
import {OkDialogComponent} from '../../shared/ok-dialog/ok-dialog.component';
import {DialogErrorComponent} from '../../auth/signup/dialog-error/dialog-error.component';

export interface DialogData {
  candidate: boolean;
  applications: [{to: number,
    name: string,
    index: number,
    haveIRated: boolean}];
}

@Component({
  selector: 'app-rate-candidate',
  templateUrl: './rate-candidate.component.html',
  styleUrls: ['./rate-candidate.component.scss']
})
export class RateCandidateComponent implements OnInit {

  form: FormGroup;
  formArray: FormArray;
  selected: string;
  authState: any;
  token: string;
  rated: any[] = [];

  private dialogShown = false;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private store$: Store<fromApp.AppState>,
    public dialogRef: MatDialogRef<RateCandidateComponent>,
    private _formBuilder: FormBuilder,
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

      this.form = new FormGroup({});
      /*new FormGroup({
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
    });*/

    if (this.data.candidate) {
      this.formArray = this._formBuilder.array([]);
      this.data.applications.forEach( (e , i) => {
        this.rated.push(e.haveIRated);
        (<FormArray>this.formArray).push(this.add());
      });
      this.form.addControl('array', this.formArray);
      this.data.applications.forEach( (e , i) => {
        this.getControl(i).controls['one'].valueChanges.subscribe(value => {
          this.getControl(i).controls['one_aux']. setValue(value);
        });

        this.getControl(i).controls['two'].valueChanges.subscribe(value => {
          this.getControl(i).controls['two_aux']. setValue(value);
        });

        this.getControl(i).controls['three'].valueChanges.subscribe(value => {
          this.getControl(i).controls['three_aux']. setValue(value);
        });

        this.getControl(i).controls['four'].valueChanges.subscribe(value => {
          this.getControl(i).controls['four_aux']. setValue(value);
        });

        this.getControl(i).controls['five'].valueChanges.subscribe(value => {
          this.getControl(i).controls['five_aux']. setValue(value);
        });

        this.getControl(i).controls['six'].valueChanges.subscribe(value => {
          this.getControl(i).controls['six_aux']. setValue(value);
        });
      });
      console.log(this.form);
    } else {
      this.selected = this.data.applications[0].name;
      this.form = this.add();
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
  }


  private getBGColour() {
    // return getColourFromIndex(this.index);
  }

  getControl(i: number) {
    return (<FormGroup>(<FormArray>this.form.get('array')).controls[i]);
  }

  add() {
    return this._formBuilder.group({
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
  }

  getName(i: number) {
    return this.data.applications[i].name;
  }

  getIndex(i: number) {
    return this.data.applications[i].index;
  }

  getRated(i: number) {
    // return this.data.applications[i].haveIRated;
    return this.rated[i];
  }

  getTo(i: number) {
    return this.data.applications[i].to;
  }

  rate(num: number) {
    const close = 'close' + num;
    window.document.getElementById(close).click();
    this.dialogShown = false;
    console.log(num);
    if ((!this.data.candidate && this.form.valid) ||
      (this.data.candidate && (<FormGroup>(<FormArray>this.form.get('array')).controls[num]).valid)) {
      const options = {
        headers: new HttpHeaders().append('token', this.token)
          .append('Content-Type', 'application/json')
      };

      let obj = {};
      let url = '';
      if (this.data.candidate) {
        url = 'rating_applicant';
        obj = {
          'fk_application': this.data.applications[num].to,
          'opinion': this.getControl(num).controls['opinion'].value,
          'efficiency': this.getControl(num).controls['one'].value,
          'skills': this.getControl(num).controls['three'].value,
          'punctuality': this.getControl(num).controls['two'].value,
          'hygiene': this.getControl(num).controls['four'].value,
          'teamwork': this.getControl(num).controls['five'].value,
          'satisfaction': this.getControl(num).controls['six'].value
        };
      } else {
        url = 'rating_offerer';
        obj = {
          'fk_application': this.data.applications[0].to,
          'opinion': this.form.controls['opinion'].value,
          'installations': this.form.controls['one'].value,
          'environment': this.form.controls['two'].value,
          'salary': this.form.controls['three'].value,
          'partners': this.form.controls['four'].value,
          'services': this.form.controls['five'].value,
          'satisfaction': this.form.controls['six'].value
        };
      }

      console.log(obj);

      this.http.post(environment.apiUrl + url,
        obj
        , options)
        .subscribe((data: any) => {
          console.log(data);
          if (!this.dialogShown) {
            const dialog = this.dialog.open(OkDialogComponent, {
              data: {
                message: 'Your rating has been successfully saved. Thank you!',
              }
            });
            dialog.afterClosed().subscribe(result => {
              // this.router.navigate(['/']);
              if (!this.data.candidate) {
                this.dialogRef.close(this.form);
              }
              if (this.data.candidate) {
                this.rated[num] = true;
                window.document.getElementById('close').click();
              }
            });
            this.dialogShown = true;
          }
        }, (error: any) => {
          console.log(error);
          if (!this.dialogShown) {
            this.dialog.open(DialogErrorComponent, {
              data: {
                header: 'We had some issue saving your rating.',
                error: 'Please try again later',
              }
            });
            this.dialogShown = true;
          }
        });

      // this.dialogRef.close(this.form);
    } else {
      if ( num !== -1) {
        for (const i of Object.keys((<FormGroup>(<FormArray>this.form.get('array')).controls[num]).controls)) {
          (<FormGroup>(<FormArray>this.form.get('array')).controls[num]).controls[i].markAsTouched();
        }
      } else {
        for (const i of Object.keys(this.form.controls)) {
          this.form.controls[i].markAsTouched();
        }
      }
    }
    return true;
  }

}
