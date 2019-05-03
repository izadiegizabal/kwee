import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import * as fromAuth from '../../../auth/store/auth.reducers';
import * as fromProfiles from '../../../profiles/store/profiles.reducers';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {MatDialog} from '@angular/material';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import {AuthEffects} from '../../../auth/store/auth.effects';
import {SignupCandidateComponent} from '../../../auth/signup/signup-candidate/signup-candidate.component';
import {WorkFields} from '../../../../models/Candidate.model';
import {isStringNotANumber} from '../../../../models/Offer.model';
import {DialogErrorComponent} from '../../../auth/signup/dialog-error/dialog-error.component';
import * as ProfilesActions from '../../../profiles/store/profiles.actions';
import {OkDialogComponent} from '../../../shared/ok-dialog/ok-dialog.component';
import {Router} from '@angular/router';

interface City {
  name: string;
  geo: {
    lat: number,
    lng: number
  };
}

@Component({
  selector: 'app-ca-account-settings',
  templateUrl: './ca-account-settings.component.html',
  styleUrls: ['./ca-account-settings.component.scss']
})
export class CaAccountSettingsComponent implements OnInit {

  // State variables
  token;
  authState: Observable<fromAuth.State>;
  profilesState: Observable<fromProfiles.State>;
  apiURL = environment.apiUrl;

  // Control variables
  hide = false;
  private dialogShown = false;

  // Form
  secondFormGroup: FormGroup;
  candidate: any;
  options: City[] = [];
  roles = Object
    .keys(WorkFields)
    .filter(isStringNotANumber)
    .map(key => ({value: WorkFields[key], viewValue: key}));

  constructor(private _formBuilder: FormBuilder,
              public dialog: MatDialog,
              private router: Router,
              private store$: Store<fromApp.AppState>, private authEffects$: AuthEffects,
              private httpClient: HttpClient) {
  }

  ngOnInit() {
    // Get profile
    this.authState = this.store$.pipe(select(state => state.auth));
    this.authState.subscribe((state) => {
      if (state && state.user && state.user.id > 0 && !this.token) {
        this.token = state.token;

        // If it's not a candidate redirect to home
        if (state.user.type !== 'candidate') {
          this.router.navigate(['/']);
        }

        this.store$.dispatch(new ProfilesActions.TryGetProfileCandidate({id: state.user.id}));
      }
    });

    // Initialise form
    this.secondFormGroup = this._formBuilder.group({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'confEmail': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.pattern('[a-zA-Z0-9_-ñ]{6,49}$')),
      'password2': new FormControl(''),
      'birthday': new FormControl(null, Validators.required),
      'location': new FormControl(null, Validators.required),
      'role': new FormControl(null, Validators.required),
    });

    this.secondFormGroup.controls['password2'].setValidators([
      this.samePassword.bind(this.secondFormGroup),
    ]);

    this.secondFormGroup.controls['confEmail'].setValidators([
      Validators.required,
      this.sameEmail.bind(this.secondFormGroup),
    ]);

    this.secondFormGroup.controls['birthday'].setValidators([
      Validators.required,
      SignupCandidateComponent.minDate.bind(this.secondFormGroup),
    ]);

    this.secondFormGroup.controls['password'].valueChanges.subscribe(value => {
      if (this.secondFormGroup.controls['password'].value != null && this.secondFormGroup.controls['password2'].value != null) {
        this.secondFormGroup.controls['password2'].updateValueAndValidity();
      }
    });

    this.secondFormGroup.controls['email'].valueChanges.subscribe(() => {
      if (this.secondFormGroup.controls['email'].value !== null && this.secondFormGroup.controls['confEmail'].value != null) {
        this.secondFormGroup.controls['confEmail'].updateValueAndValidity();
      }
    });

    // Prepopulate form
    this.profilesState = this.store$.pipe(select(state => state.profiles));
    this.profilesState.subscribe((state) => {
        if (state.candidate) {
          this.secondFormGroup.controls['name'].setValue(state.candidate.name);
          this.secondFormGroup.controls['email'].setValue(state.candidate.email);
          this.secondFormGroup.controls['confEmail'].setValue(state.candidate.email);
          this.secondFormGroup.controls['birthday'].setValue(state.candidate.dateBorn);
          this.secondFormGroup.controls['location'].setValue({name: state.candidate.city, geo: null});
          this.secondFormGroup.controls['role'].setValue(state.candidate.rol);
        }
      }
    );
  }

  onSave() {
    this.dialogShown = false;

    if (this.secondFormGroup.status === 'VALID') {

      // Construct candidate to submit
      this.candidate = {
        'name': this.secondFormGroup.controls['name'].value,
        'email': this.secondFormGroup.controls['email'].value,
        'dateBorn': this.secondFormGroup.controls['birthday'].value,
        'rol': this.secondFormGroup.controls['role'].value.toString(),
      };


      if (this.secondFormGroup.controls['password'].value && this.secondFormGroup.controls['password'].value !== '') {
        this.candidate['password'] = this.secondFormGroup.controls['password'].value;
      }

      if ((this.secondFormGroup.controls['location'].value as City) && (this.secondFormGroup.controls['location'].value as City).name) {
        this.candidate['city'] = (this.secondFormGroup.controls['location'].value as City).name;
      }

      // Submit the update
      // PUT modified candidate
      const options = {
        headers: new HttpHeaders().append('token', this.token)
          .append('Content-Type', 'application/json')
      };
      this.httpClient.put(environment.apiUrl + 'applicant', this.candidate, options)
        .subscribe((data: any) => {
            if (!this.dialogShown) {
              this.dialog.open(OkDialogComponent, {
                data: {
                  message: 'Account info updated correctly!',
                }
              });
              this.dialogShown = true;
            }
          }, (error: any) => {
            // console.log(error);
            if (!this.dialogShown) {
              this.dialog.open(DialogErrorComponent, {
                data: {
                  header: 'We had some issues updating your settings',
                  error: 'Please try again later',
                }
              });
              this.dialogShown = true;
            }
          }
        )
      ;
    } else {
      console.log('not valid form');
      console.log(this.secondFormGroup);
      for (const i of Object.keys(this.secondFormGroup.controls)) {
        this.secondFormGroup.controls[i].markAsTouched();
      }
    }
  }

  // Helper methods
  samePassword(control: FormControl) {
    const userForm: any = this;
    if (control.value !== userForm.controls['password'].value) {
      return {different: true};
    }
    return null;
  }

  sameEmail(control: FormControl): { [s: string]: boolean } {
    const secondFormGroup: any = this;
    if (control.value !== secondFormGroup.controls['email'].value) {
      return {same: true};
    }
    return null;
  }

  // Location
  displayFn(city?: City): string | undefined {
    return city ? city.name : undefined;
  }

  onKey(event: any) {

    if (event.key !== 'ArrowUp' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'Enter') {
      const text: string = (document.getElementById('city') as HTMLInputElement).value;
      if (text.length > 2) {
        const options = {
          params: new HttpParams().set('query', text)
            .append('type', 'city'),
          headers: new HttpHeaders().append('X-Algolia-Application-Id', environment.algoliaAppId)
            .append('X-Algolia-API-Key', environment.algoliaAPIKey)
        };
        this.options = [];
        this.httpClient.get('https://places-dsn.algolia.net/1/places/query', options)
          .subscribe((data: any) => {
            // console.log(data);
            data.hits.forEach((e, i) => {
              const auxCity = {
                name: data.hits[i].locale_names.default + ', ' + SignupCandidateComponent.capitalizeFirstLetter(data.hits[i].country_code),
                geo: data.hits[i]._geoloc ? data.hits[i]._geoloc : {}
              };
              if (data.hits[i].is_city) {
                if (!this.options.some(element => element.name === auxCity.name)) {
                  this.options.push(auxCity);
                }
              }
            });
          });
      } else {
        this.options = [];
      }
    }
  }
}
