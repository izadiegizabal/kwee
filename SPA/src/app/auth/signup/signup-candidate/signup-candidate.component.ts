import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatStepper} from '@angular/material';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as AuthActions from '../../store/auth.actions';
import {AuthEffects} from '../../store/auth.effects';
import {filter} from 'rxjs/operators';
import {DialogErrorComponent} from '../dialog-error/dialog-error.component';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DialogImageCropComponent} from '../dialog-image-crop/dialog-image-crop.component';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {isStringNotANumber} from '../../../../models/Offer.model';
import {LanguageLevels, WorkFields} from '../../../../models/Candidate.model';

import * as _moment from 'moment';
import {OkDialogComponent} from "../../../shared/ok-dialog/ok-dialog.component";
const moment = _moment;

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

  @ViewChild('stepper') stepper: MatStepper;
  options: City[] = [];
  fileEvent = null;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  candidate: any;
  hide = false;
  iskill = 0;
  isSocialNetwork = false;
  snToken;
  token;
  primera = false;
  authState: any;
  file: any;
  name: string;
  email: string;
  roles = Object
    .keys(WorkFields)
    .filter(isStringNotANumber)
    .map(key => ({value: WorkFields[key], viewValue: key}));
  proficiencies = Object
    .keys(LanguageLevels)
    .filter(isStringNotANumber)
    .map(key => ({value: LanguageLevels[key], viewValue: key}));
  private dialogShown = false;

  constructor(private _formBuilder: FormBuilder,
              public dialog: MatDialog,
              private store$: Store<fromApp.AppState>, private authEffects$: AuthEffects,
              private httpClient: HttpClient,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.iskill = 0;
  }

  get formSkills() {
    return <FormArray>this.thirdFormGroup.get('skills');
  }

  get formLanguages() {
    return <FormArray>this.thirdFormGroup.get('languages');
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

  // LONGITUDE -180 to + 180
  static generateRandomLong() {
    let num = +(Math.random() * 180).toFixed(3);
    const sign = Math.floor(Math.random());
    if (sign === 0) {
      num = num * -1;
    }
    return num;
  }

  // LATITUDE -90 to +90
  static generateRandomLat() {
    let num = +(Math.random() * 90).toFixed(3);
    const sign = Math.floor(Math.random());
    if (sign === 0) {
      num = num * -1;
    }
    return num;
  }

  static capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getProf(n: number) {
    return this.proficiencies[n].viewValue;
  }

  ngOnInit() {

    this.authState = this.store$.pipe(select('auth'));
    this.authState.pipe(
      select((s: { token: string }) => s.token)
    ).subscribe(
      (token) => {
        this.token = token;
      });

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
      'terms': new FormControl(null, Validators.required)
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
      'profile': new FormControl(null),
      'bio': new FormControl(null),
      'twitter': new FormControl(null),
      'linkedIn': new FormControl(null),
      'github': new FormControl(null),
      'telegram': new FormControl(null),
      'skills': new FormArray([new FormControl(null)]),
      'languages': this._formBuilder.array([]),
      'experience': this._formBuilder.array([]),
      'education': this._formBuilder.array([])
    });

    this.thirdFormGroup.controls['twitter'].valueChanges.subscribe(() => {
      const value = <String>this.thirdFormGroup.controls['twitter'].value;
      if (value.includes('twitter.com/')) {
        const arr = value.split('twitter.com/');
        this.thirdFormGroup.controls['twitter'].setValue(arr[arr.length - 1]);
      }
    });

    this.thirdFormGroup.controls['linkedIn'].valueChanges.subscribe(() => {
      let value = this.thirdFormGroup.controls['linkedIn'].value;
      if (value.includes('linkedin.com/in/')) {
        let arr = value.split('linkedin.com/in/');
        value = arr[arr.length - 1];
        arr = value.split('/');
        value = arr[0];
        this.thirdFormGroup.controls['linkedIn'].setValue(value);
      }
    });

    this.thirdFormGroup.controls['github'].valueChanges.subscribe(() => {
      const value = <String>this.thirdFormGroup.controls['github'].value;
      if (value.includes('github.com/')) {
        const arr = value.split('github.com/');
        this.thirdFormGroup.controls['github'].setValue(arr[arr.length - 1]);
      }
    });

    this.thirdFormGroup.controls['telegram'].valueChanges.subscribe(() => {
      const value = <String>this.thirdFormGroup.controls['telegram'].value;
      if (value.includes('telegram.me/')) {
        const arr = value.split('telegram.me/');
        this.thirdFormGroup.controls['telegram'].setValue(arr[arr.length - 1]);
      }
      if (value.includes('t.me/')) {
        const arr = value.split('t.me/');
        this.thirdFormGroup.controls['telegram'].setValue(arr[arr.length - 1]);
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {

      if (params['token']) {
        const token = params['token'];
        this.snToken = token;
        this.name = params['name'];
        this.email = params['email'];

        this.secondFormGroup.controls['name'].setValue(this.name);
        this.secondFormGroup.controls['email'].setValue(this.email);
        this.secondFormGroup.controls['confEmail'].setValue(this.email);
        this.secondFormGroup.controls['password'].setValue('123456');
        this.secondFormGroup.controls['password2'].setValue('123456');
        this.isSocialNetwork = true;

        if (!this.primera) {
          this.stepper.selectedIndex = 1;
        }
      }
    });


    this.authEffects$.authSNUser.pipe(
      filter((action: Action) => action.type === AuthActions.SN_USER)
    ).subscribe(() => {
      this.stepper.selectedIndex = 2;
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

    if (this.secondFormGroup.status === 'VALID') {
      if (!this.isSocialNetwork) {
        if ((this.secondFormGroup.controls['location'].value as City).geo === undefined) {
          if (this.options.length > 0) {
            this.secondFormGroup.controls['location'].setValue(this.options[0]);
          } else {
            const auxCity = {
              name: this.secondFormGroup.controls['location'].value,
              geo: {
                lat: SignupCandidateComponent.generateRandomLat(),
                lng: SignupCandidateComponent.generateRandomLong()
              }
            };
            this.secondFormGroup.controls['location'].setValue(auxCity);
          }
        }
        this.candidate = {
          'name': this.secondFormGroup.controls['name'].value,
          'password': this.secondFormGroup.controls['password'].value,
          'email': this.secondFormGroup.controls['email'].value,
          'city': (this.secondFormGroup.controls['location'].value as City).name
            ? (this.secondFormGroup.controls['location'].value as City).name
            : this.secondFormGroup.controls['location'].value,
          'dateBorn': this.secondFormGroup.controls['birthday'].value,
          'premium': '0',
          'rol': this.secondFormGroup.controls['role'].value.toString(),
          'lng': (this.secondFormGroup.controls['location'].value as City).geo.lng,
          'lat': (this.secondFormGroup.controls['location'].value as City).geo.lat
        };

        this.store$.dispatch(new AuthActions.TrySignupCandidate(this.candidate));

        this.authEffects$.authSignin.pipe(
          filter((action: Action) => action.type === AuthActions.SIGNIN)
        ).subscribe(() => {
          stepper.next();
        });

      } else {

        // Update of user that is coming by social network with his birthday, role and location
        const updateuser = {
          'name': this.secondFormGroup.controls['name'].value,
          'city': (this.secondFormGroup.controls['location'].value as City).name
            ? (this.secondFormGroup.controls['location'].value as City).name
            : this.secondFormGroup.controls['location'].value,
          'dateBorn': this.secondFormGroup.controls['birthday'].value,
          'rol': this.secondFormGroup.controls['role'].value.toString(),
          'lng': (this.secondFormGroup.controls['location'].value as City).geo.lng,
          'lat': (this.secondFormGroup.controls['location'].value as City).geo.lat,
          'premium': '0',
        };

        this.store$.dispatch(new AuthActions.TrySigninSN({
          'token': this.snToken,
          'type': 'candidate',
          'user': updateuser
        }));
      }

      this.authEffects$.authSignupCandidate.pipe(
        filter((action: Action) => action.type === AuthActions.AUTH_ERROR)
      ).subscribe((error: { payload: any, type: string }) => {
        if (!this.dialogShown) {
         // console.log(error.payload);
          this.dialog.open(DialogErrorComponent, {
            data: {
              header: 'The Sing Up has failed. Please go back and try again.',
              error: 'Error: ' + error.payload,
            }
          });
          this.dialogShown = true;
        }
      });
    } else {
     // console.log('not valid form');
      for (const i of Object.keys(this.secondFormGroup.controls)) {
        this.secondFormGroup.controls[i].markAsTouched();
      }
    }
    stepper.next();
  }

  onSaveOptional() {

    // Prepare the update object
    const update = {
      'bio': this.thirdFormGroup.controls['bio'].value,
      'social_networks': {
        'twitter': this.thirdFormGroup.controls['twitter'].value,
        'linkedin': this.thirdFormGroup.controls['linkedIn'].value,
        'github': this.thirdFormGroup.controls['github'].value,
        'telegram': this.thirdFormGroup.controls['telegram'].value,
      },
      'languages': this.thirdFormGroup.controls['languages'].value,
      'experiences': this.getFormattedExperiences(),
      'educations': this.getFormattedEducations(),
      'skills': this.getFormattedSkills()
    };
    if (this.file) {
      update['img'] = this.file;
    }

    console.log(update);
    // Try to update
    const options = {
      headers: new HttpHeaders().append('token', this.token)
        .append('Content-Type', 'application/json')
    };
    this.httpClient.post(environment.apiUrl + 'applicant/info', update, options)
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
        console.log(error);
        if (!this.dialogShown) {
          this.dialog.open(DialogErrorComponent, {
            data: {
              header: 'We had some issues updating your settings',
              error: 'Please try again later',
            }
          });
          this.dialogShown = true;
        }
      });
  }

  // Format data for the API
  getFormattedSkills(): any[] {
    const skills = [];
    for (const skill of this.thirdFormGroup.controls['skills'].value) {

      if (skill) {
        const newSkill = {
          name: skill as string,
          description: '',
          level: '',
        };

        skills.push(newSkill);
      }
    }
    return skills;
  }

  getFormattedExperiences(): any[] {
    const experiences = [];
    for (const experience of this.thirdFormGroup.controls['experience'].value) {

      // Go from Moment object to the desired data format
      if (experience.end) {
        experience.end = moment(experience.end).format('YYYY-MM-DD');
      } else {
        experience.end = moment().format('YYYY-MM-DD');
      }
      experience.start = moment(experience.start).format('YYYY-MM-DD');

      // Rename the keys
      Object.defineProperty(experience, 'dateEnd', Object.getOwnPropertyDescriptor(experience, 'end'));
      delete experience['end'];
      Object.defineProperty(experience, 'dateStart', Object.getOwnPropertyDescriptor(experience, 'start'));
      delete experience['start'];

      experiences.push(experience);
    }
    return experiences;
  }

  getFormattedEducations(): any[] {
    const educations = [];
    for (const education of this.thirdFormGroup.controls['education'].value) {
      // Go from Moment object to the desired data format
      if (education.end) {
        education.end = moment(education.end).format('YYYY-MM-DD');
      } else {
        education.end = moment().format('YYYY-MM-DD');
      }
      education.start = moment(education.start).format('YYYY-MM-DD');

      // Rename the keys
      Object.defineProperty(education, 'dateEnd', Object.getOwnPropertyDescriptor(education, 'end'));
      delete education['end'];
      Object.defineProperty(education, 'dateStart', Object.getOwnPropertyDescriptor(education, 'start'));
      delete education['start'];

      educations.push(education);
    }
    return educations;
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
    // console.log(this.formLanguages);
  }

  deleteSkill(i) {
    (<FormArray>this.thirdFormGroup.controls['skills']).removeAt(i);
    this.iskill--;
  }

  deleteLanguage(i) {
    (<FormArray>this.thirdFormGroup.controls['languages']).removeAt(i);
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

  googleSignUp() {
    console.log('google Sign Up');
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
    window.location.href = environment.apiUrl + 'google';
    // stepper.next();
  }

  gitHubSignUp() {
    window.location.href = environment.apiUrl + 'auth/github/candidate';
  }


  linkedInSignUp() {
    window.location.href = environment.apiUrl + 'auth/linkedin/candidate';
  }

  twitterSignUp() {
    window.location.href = environment.apiUrl + 'auth/twitter';
  }

  deletePhoto() {
    (document.getElementById('photo_profile') as HTMLInputElement).src = '../../../../assets/img/defaultProfileImg.png';
    this.thirdFormGroup.controls['profile'].setValue(null);
  }


  previewFile(event: any) {

    this.fileEvent = event;
    /// 3MB IMAGES MAX
    if (event.target.files[0]) {
      if (event.target.files[0].size < 3000000) {
        // @ts-ignore
        const preview = (document.getElementById('photo_profile') as HTMLInputElement);
        const file = (document.getElementById('file_profile') as HTMLInputElement).files[0];
        const reader = new FileReader();
        reader.onloadend = function () {
          // @ts-ignore
          preview.src = reader.result;
        };
        reader.readAsDataURL(file);

        const dialogRef = this.dialog.open(DialogImageCropComponent, {
          width: '90%',
          height: '90%',
          data: event
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            preview.src = result;
            this.file = result;
          }
        });
      } else {
        this.deletePhoto();
        this.dialog.open(DialogErrorComponent, {
          data: {
            header: 'The Upload process has failed. Please try again later or use another image.',
            error: 'Error: Your image is too big. We only allow files under 3Mb.',
          }
        });
        this.dialogShown = true;
      }
    } else {
      this.deletePhoto();
    }
  }

}
