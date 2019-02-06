import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatStepper} from '@angular/material';
import {Action, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as AuthActions from '../../store/auth.actions';
import {AuthEffects} from '../../store/auth.effects';
import {filter} from 'rxjs/operators';
import {DialogErrorComponent} from '../dialog-error/dialog-error.component';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

interface City {
  name: string;
  geo: {
    lat: number,
    lng: number
  };
}


@Component({
  selector: 'app-signup-candidate',
  templateUrl: './signup-candidate.component.html',
  styleUrls: ['./signup-candidate.component.scss'],
})

export class SignupCandidateComponent implements OnInit {

  options: City[] = [];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  candidate: any;
  hide = false;
  iskill = 0;
  iskillang = 0;
  roles: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Software Engineering'},
    {value: 1, viewValue: 'Engineering Management'},
    {value: 2, viewValue: 'Design'},
    {value: 3, viewValue: 'Data Analytics'},
    {value: 4, viewValue: 'Developer Operations'},
    {value: 5, viewValue: 'Quality Assurance'},
    {value: 6, viewValue: 'Information Technology'},
    {value: 7, viewValue: 'Project Management'},
    {value: 8, viewValue: 'Product Management'},
  ];
  proficiencies: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Native'},
    {value: 1, viewValue: 'Begginer - A1'},
    {value: 2, viewValue: 'Elementary - A2'},
    {value: 3, viewValue: 'Intermediate - B1'},
    {value: 4, viewValue: 'Upper Intermediate - B2'},
    {value: 5, viewValue: 'Advanced - C1'},
    {value: 6, viewValue: 'Proficient - C2'},
  ];
  private dialogShown = false;

  constructor(private _formBuilder: FormBuilder,
              public dialog: MatDialog,
              private store$: Store<fromApp.AppState>, private authEffects$: AuthEffects,
              private httpClient: HttpClient) {
    this.iskill = 0;
    this.iskillang = 0;
  }

  get formSkills() {
    return <FormArray>this.thirdFormGroup.get('skills');
  }

  get formLanguages() {
    return <FormArray>this.thirdFormGroup.get('languages');
  }

  get formExperience() {
    return <FormArray>this.thirdFormGroup.get('experience');
  }

  get formEducation() {
    return <FormArray>this.thirdFormGroup.get('education');
  }

  static minDate(control: FormControl): { [s: string]: { [s: string]: boolean } } {
    const today = new Date();
    const mdate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDay());

    if (control.value > mdate) {
      return {'min16years': {value: true}};
    }
    return null;
  }

  static maxMinDate(control: FormControl): { [s: string]: { [s: string]: boolean } } {
    const today = new Date();
    const mdate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDay());

    if (control.value > mdate) {
      return null;
    }
    return {'tooOld': {value: true}};
  }

  getProf(n: number) {
    return this.proficiencies[n].viewValue;
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'confEmail': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z0-9_-ñ]{6,49}$')]),
      'password2': new FormControl(null, Validators.required),
      'birthday': new FormControl(null, Validators.required),
      'location': new FormControl(null, Validators.required),
      'role': new FormControl(null, Validators.required),
    });

    this.secondFormGroup.controls['password2'].setValidators([
      Validators.required,
      this.samePassword.bind(this.secondFormGroup),
    ]);

    this.secondFormGroup.controls['confEmail'].setValidators([
      Validators.required,
      this.sameEmail.bind(this.secondFormGroup),
    ]);

    this.secondFormGroup.controls['birthday'].setValidators([
      Validators.required,
      SignupCandidateComponent.minDate.bind(this.secondFormGroup),
      SignupCandidateComponent.maxMinDate.bind(this.secondFormGroup),
    ]);


    this.secondFormGroup.controls['password'].valueChanges.subscribe(() => {
      this.secondFormGroup.controls['password2'].updateValueAndValidity();
    });

    this.secondFormGroup.controls['email'].valueChanges.subscribe(() => {
      if (this.secondFormGroup.controls['email'].value != null && this.secondFormGroup.controls['confEmail'].value != null) {
        this.secondFormGroup.controls['confEmail'].updateValueAndValidity();
      }
    });


    this.thirdFormGroup = this._formBuilder.group({
      'bio': new FormControl(null),
      'skills': new FormArray([new FormControl(null)]),
      'languages': this._formBuilder.array([]),
      'experience': this._formBuilder.array([]),
      'education': this._formBuilder.array([])
    });

  }

  addLanguageGroup(): FormGroup {
    return this._formBuilder.group({
      'language': new FormControl(null, Validators.required),
      'proficiency': new FormControl(null, Validators.required)
    });
  }


  samePassword(control: FormControl): { [s: string]: boolean } {
    const secondFormGroup: any = this;
    if (control.value !== secondFormGroup.controls['password'].value) {
      return {same: true};
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

  onSave(stepper: MatStepper) {
    this.dialogShown = false;
    // console.log(this.secondFormGroup);
    console.log(this.secondFormGroup.controls['location'].value);

    if (this.secondFormGroup.status === 'VALID') {

      this.candidate = {
        'name': this.secondFormGroup.controls['name'].value,
        'password': this.secondFormGroup.controls['password'].value,
        'email': this.secondFormGroup.controls['email'].value,
        'city': this.secondFormGroup.controls['location'].value,
        'dateBorn': this.secondFormGroup.controls['birthday'].value,
        'premium': '0',
        'rol': this.secondFormGroup.controls['role'].value.toString()
      };

      // console.log(this.candidate);
      this.store$.dispatch(new AuthActions.TrySignupCandidate(this.candidate));
      this.authEffects$.authSignin.pipe(
        filter((action: Action) => action.type === AuthActions.SIGNIN)
      ).subscribe(() => {
        stepper.next();
      });
      this.authEffects$.authSignupCandidate.pipe(
        filter((action: Action) => action.type === AuthActions.AUTH_ERROR)
      ).subscribe((error: { payload: any, type: string }) => {
        if (!this.dialogShown) {
          console.log(error.payload);
          this.dialog.open(DialogErrorComponent, {
            data: {
              error: error.payload,
            }
          });
          this.dialogShown = true;
        }
      });
    } else {
      for (const i of Object.keys(this.secondFormGroup.controls)) {
        this.secondFormGroup.controls[i].markAsTouched();
      }
    }
    // stepper.next();
  }

  onSaveOptional() {
    // console.log(this.thirdFormGroup);
  }

  add_skill() {
    (<FormArray>this.thirdFormGroup.controls['skills']).push(new FormControl(null));
    this.iskill++;
    // console.log(this.formSkills.length);
    setTimeout(() => {
      document.getElementById(`skill${this.iskill}`).focus();
    }, 1);
  }

  addLanguage() {
    (<FormArray>this.thirdFormGroup.controls['languages']).push(this.addLanguageGroup());
    this.iskillang++;
    // console.log(this.formLanguages);
  }

  deleteSkill(i) {
    (<FormArray>this.thirdFormGroup.controls['skills']).removeAt(i);
    this.iskill--;
  }

  deleteLanguage(i) {
    (<FormArray>this.thirdFormGroup.controls['languages']).removeAt(i);
    this.iskillang--;
  }

  onDoneLang(index: number) {
    if (!(<FormArray>this.thirdFormGroup.controls['languages']).controls[index].valid) {
      (<FormGroup>(<FormArray>this.thirdFormGroup.get('languages')).controls[index]).controls.language.markAsTouched();
      (<FormGroup>(<FormArray>this.thirdFormGroup.get('languages')).controls[index]).controls.proficiency.markAsTouched();
    } else {
      return true;
    }
    return false;
  }

  formInitialized(name: string, form: FormGroup) {
    this.thirdFormGroup.setControl(name, form);
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  displayFn(city?: City): string | undefined {
    return city ? city.name : undefined;
  }

  onKey(event: any) { // without type info
    // q=benidorm&format=json&addressdetails=1&limit=5&polygon_svg=1

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
        // https://nominatim.openstreetmap.org/search/03502?format=json&addressdetails=1&limit=5&polygon_svg=1
        this.httpClient.get('https://places-dsn.algolia.net/1/places/query', options)
          .subscribe((data: any) => {
            console.log(data);
            data.hits.forEach((e, i) => {
              const auxCity = {
                name: data.hits[i].locale_names.default + ', ' + this.capitalizeFirstLetter(data.hits[i].country_code),
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

  googleSignUp(stepper: MatStepper) {
    console.log('google Sign Up');
    this.store$.dispatch(new AuthActions.TrySignupGoogle());


    // this.authEffects$.authSignupGoogle.pipe(
    //   filter((action: Action) => action.type === AuthActions.AUTH_ERROR)
    // ).subscribe((error: { payload: any, type: string }) => {
    //   if (!this.dialogShown) {
    //     console.log(error.payload);
    //     this.dialog.open(DialogErrorComponent, {
    //       data: {
    //         error: error.payload,
    //       }
    //     });
    //     this.dialogShown = true;
    //   }
    // });
    // stepper.next();
  }

  gitHubSignUp(stepper: MatStepper) {
    console.log('GitHub Sign Up');
    this.store$.dispatch(new AuthActions.TrySignupGitHub());
    stepper.next();
  }

  linkedInSignUp(stepper: MatStepper) {
    console.log('linkedIn Sign Up');
    this.store$.dispatch(new AuthActions.TrySignupLinkedIn());
    // stepper.next();
  }

  twitterSignUp(stepper: MatStepper) {
    console.log('twitter Sign Up');
    stepper.next();

  }

}
