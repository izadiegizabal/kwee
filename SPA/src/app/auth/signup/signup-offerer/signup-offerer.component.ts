import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogErrorComponent} from '../dialog-error/dialog-error.component';
import {MatDialog, MatStepper} from '@angular/material';
import * as AuthActions from '../../store/auth.actions';
import {filter} from 'rxjs/operators';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import {AuthEffects} from '../../store/auth.effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DialogImageCropComponent} from '../dialog-image-crop/dialog-image-crop.component';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {BusinessIndustries, BusinessSize} from '../../../../models/Business.model';
import {isStringNotANumber} from '../../../../models/Offer.model';

export interface City {
  name: string;
  geo: {
    lat: number,
    lng: number
  };
}

export interface Address {
  ad1: string;
  ad2: string;
}


@Component({
  selector: 'app-signup-offerer',
  templateUrl: './signup-offerer.component.html',
  styleUrls: ['./signup-offerer.component.scss',
    '../signup-candidate/signup-candidate.component.scss']
})
export class SignupOffererComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;

  options = [];
  address: Address;
  fileEvent = null;
  file: any;
  cities = [];
  countries = [];

  isSocialNetwork = false;
  snToken;
  primera = false;


  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  hide = false;
  offerer: any;
  token;
  authState: any;

  workFields = Object
    .keys(BusinessIndustries)
    .filter(isStringNotANumber)
    .map(key => ({value: BusinessIndustries[key], viewValue: key}));

  companySizes = Object
    .keys(BusinessSize)
    .filter(isStringNotANumber)
    .map(key => ({value: BusinessSize[key], viewValue: key}));


  private dialogShown = false;

  constructor(private _formBuilder: FormBuilder,
              public dialog: MatDialog,
              private store$: Store<fromApp.AppState>, private authEffects$: AuthEffects,
              private httpClient: HttpClient,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.address = {ad1: null, ad2: null};
  }


  static maxDate(control: FormControl): { [s: string]: { [s: string]: boolean } } {
    const today = new Date();

    if (control.value <= today.getFullYear() && control.value >= 0) {
      return null;
    }
    return {'tooDumb': {value: true}};
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

  ngOnInit() {

    this.authState = this.store$.pipe(select('auth'));
    this.authState.pipe(
      select((s: { token: string }) => s.token)
    ).subscribe(
      (token) => {
        this.token = token;
      });


    this.firstFormGroup = this._formBuilder.group({});


    this.secondFormGroup = this._formBuilder.group({
      'businessName': new FormControl(null, Validators.required),
      'vat': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'confEmail': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z0-9_-ñ]{6,49}$')]),
      'password2': new FormControl(null, Validators.required),
      'workField': new FormControl(null, Validators.required),
      'address1': new FormControl(null, Validators.required),
      'terms': new FormControl(null, Validators.required),
      'city': new FormControl(null, Validators.required),
      'state': new FormControl(null, Validators.required),
      'postal': new FormControl(null, Validators.required),
      'country': new FormControl(null, Validators.required),
      'profile': new FormControl(null)
    });

    this.thirdFormGroup = this._formBuilder.group({
      'about': new FormControl(),
      'twitter': new FormControl(null),
      'linkedIn': new FormControl(null),
      'github': new FormControl(null),
      'telegram': new FormControl(null),
      'profile': new FormControl(),
      'website': new FormControl(),
      'companySize': new FormControl(),
      'year': new FormControl(),
    });


    this.secondFormGroup.controls['password2'].setValidators([
      Validators.required,
      this.samePassword.bind(this.secondFormGroup),
    ]);

    this.secondFormGroup.controls['confEmail'].setValidators([
      Validators.required,
      this.sameEmail.bind(this.secondFormGroup),
    ]);


    this.secondFormGroup.controls['password'].valueChanges.subscribe(value => {
      if (this.secondFormGroup.controls['password'].value != null && this.secondFormGroup.controls['password2'].value != null) {
        this.secondFormGroup.controls['password2'].updateValueAndValidity();
      }
    });


    this.secondFormGroup.controls['email'].valueChanges.subscribe(value => {
      if (this.secondFormGroup.controls['email'].value != null && this.secondFormGroup.controls['confEmail'].value != null) {
        this.secondFormGroup.controls['confEmail'].updateValueAndValidity();
      }
    });

    /*this.secondFormGroup.controls['address1'].valueChanges.subscribe(value => {
      if (this.secondFormGroup.controls['address1'].value) {
        const aux = this.secondFormGroup.controls['address1'].value;
        if (aux.second) {
          this.secondFormGroup.controls['address2'].setValue(aux.second);
        }
      }
    });*/

    this.thirdFormGroup.controls['year'].setValidators([
      SignupOffererComponent.maxDate.bind(this.thirdFormGroup),
    ]);

    this.thirdFormGroup.controls['year'].valueChanges.subscribe(value => {
      this.thirdFormGroup.controls['year'].updateValueAndValidity();
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

        this.secondFormGroup.controls['businessName'].setValue(params['name']);
        this.secondFormGroup.controls['email'].setValue(params['email']);
        this.secondFormGroup.controls['confEmail'].setValue(params['email']);
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
    if (this.secondFormGroup.status === 'VALID') {

      let finalAddress = '';
      finalAddress += this.secondFormGroup.controls['address1'].value.name ?
        this.secondFormGroup.controls['address1'].value.name : this.secondFormGroup.controls['address1'].value;
      finalAddress += this.secondFormGroup.controls['city'].value.name ?
        ', ' + this.secondFormGroup.controls['city'].value.name : ', ' + this.secondFormGroup.controls['city'].value;
      finalAddress += ', ' + this.secondFormGroup.controls['state'].value;
      finalAddress += ', ' + this.secondFormGroup.controls['postal'].value;
      finalAddress += ', ' + this.secondFormGroup.controls['country'].value;
      let lat = SignupOffererComponent.generateRandomLat(), lng = SignupOffererComponent.generateRandomLong();
      if (this.secondFormGroup.controls['address1'].value.geo) {
        lat = this.secondFormGroup.controls['address1'].value.geo.lat;
        lng = this.secondFormGroup.controls['address1'].value.geo.lng;
      } else if (this.secondFormGroup.controls['city'].value.geo) {
        lat = this.secondFormGroup.controls['city'].value.geo.lat;
        lng = this.secondFormGroup.controls['city'].value.geo.lng;
      } else if (this.options.length > 0) {
        lat = this.options[0].geo.lat;
        lng = this.options[0].geo.lng;
      } else if (this.cities.length > 0 && this.cities[0].geo) {
        lat = this.cities[0].geo.lat;
        lng = this.cities[0].geo.lng;
      }

      this.offerer = {
        'name': this.secondFormGroup.controls['businessName'].value,
        'password': this.secondFormGroup.controls['password'].value,
        'email': this.secondFormGroup.controls['email'].value,
        'address': finalAddress,
        'cif': this.secondFormGroup.controls['vat'].value,
        'workField': this.secondFormGroup.controls['workField'].value,
        'premium': '0',
        'companySize': '50',
        'bio': '',
        'img': this.file,
        'status': '0',
        'lng': lng,
        'lat': lat
      };
      // console.log(this.offerer);

      if (!this.isSocialNetwork) {
        // POST new offerer
        this.store$.dispatch(new AuthActions.TrySignupBusiness(this.offerer));
        this.authEffects$.authSignin.pipe(
          filter((action: Action) => action.type === AuthActions.SIGNIN)
        ).subscribe(() => {
          stepper.next();
        });
        this.authEffects$.authSignupBusiness.pipe(
          filter((action: Action) => action.type === AuthActions.AUTH_ERROR)
        ).subscribe((error: { payload: any, type: string }) => {
          if (!this.dialogShown) {
            console.log(error.payload);
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
        this.store$.dispatch(new AuthActions.TrySigninSN({
          'token': this.snToken,
          'type': 'business',
          'user': this.offerer
        }));
      }
    }
  }

  onUpdate() {

    const update = {
      'about': this.thirdFormGroup.controls['about'].value,
      'twitter': this.thirdFormGroup.controls['twitter'].value,
      'linkedIn': this.thirdFormGroup.controls['linkedIn'].value,
      'github': this.thirdFormGroup.controls['github'].value,
      'telegram': this.thirdFormGroup.controls['telegram'].value,
      'website': this.thirdFormGroup.controls['website'].value,
      'companySize': this.thirdFormGroup.controls['companySize'].value,
      'year': this.thirdFormGroup.controls['year'].value
    };

    const options = {
      headers: new HttpHeaders().append('token', this.token)
        .append('Content-Type', 'application/json')
    };
    this.httpClient.put(environment.apiUrl + 'offerer',
      update
      , options)
      .subscribe((data: any) => {
        // console.log(data);
        this.router.navigate(['/']);
      }, (error: any) => {
        // console.log(error);
        if (!this.dialogShown) {
          this.dialog.open(DialogErrorComponent, {
            data: {
              header: 'We had some issue signing up',
              error: 'Please try again later',
            }
          });
          this.dialogShown = true;
        }
      });
  }

  displayFn(city?: any): string | undefined {
    return city ? city.name : undefined;
  }

  displayFnAddress(address?: any): string | undefined {
    return address ? address.name : undefined;
  }

  searchCity(event: any) {
    if (event.key !== 'ArrowUp' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'Enter') {

      const city = this.secondFormGroup.get('city').value;

      if ((city as string).length > 2) {
        const options = {
          params: new HttpParams().set('query', city)
            .append('type', 'city'),
          headers: new HttpHeaders().append('X-Algolia-Application-Id', environment.algoliaAppId)
            .append('X-Algolia-API-Key', environment.algoliaAPIKey)
        };
        this.cities = [];
        this.httpClient.get('https://places-dsn.algolia.net/1/places/query', options)
          .subscribe((data: any) => {
            this.cities = [];
            data.hits.forEach((e, i) => {
              if (data.hits[i].locale_names.default) {
                const cityObj = {
                  name: data.hits[i].locale_names.default[0],
                  admin: data.hits[i].administrative ? data.hits[i].administrative[0] : '',
                  country: data.hits[i].country ? data.hits[i].country.default : '',
                  postcode: data.hits[i].postcode ? data.hits[i].postcode[0] : '',
                  geo: data.hits[i]._geoloc ? data.hits[i]._geoloc : {}
                };
                if (!this.cities.some(element => element.name === cityObj.name)) {
                  this.cities.push(cityObj);
                }
              }
            });
          });
      } else {
        this.cities = [];
      }
    }
  }

  log() {
    const address = this.secondFormGroup.get('city').value;
    this.secondFormGroup.get('country').setValue(address.country);
    this.secondFormGroup.get('postal').setValue(address.postcode);
    this.secondFormGroup.get('state').setValue(address.admin);
  }

  logAddress() {
    const address = this.secondFormGroup.get('address1').value;
    this.secondFormGroup.get('city').setValue(address.city);
    this.secondFormGroup.get('country').setValue(address.country);
    this.secondFormGroup.get('postal').setValue(address.postcode);
    this.secondFormGroup.get('state').setValue(address.admin);
  }

  searchCountry(event: any) {
    if (event.key !== 'ArrowUp' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'Enter') {

      const country = this.secondFormGroup.get('country').value;

      if ((country as string).length > 2) {
        const options = {
          params: new HttpParams().set('query', country)
            .append('type', 'country'),
          headers: new HttpHeaders().append('X-Algolia-Application-Id', environment.algoliaAppId)
            .append('X-Algolia-API-Key', environment.algoliaAPIKey)
        };
        this.countries = [];
        this.httpClient.get('https://places-dsn.algolia.net/1/places/query', options)
          .subscribe((data: any) => {
            this.countries = [];
            data.hits.forEach((e, i) => {
              if (data.hits[i].locale_names.default) {
                if (!this.countries.some(element => element === data.hits[i].locale_names.default)) {
                  this.countries.push(data.hits[i].locale_names.default);
                }
              }
            });
          });
      } else {
        this.countries = [];
      }
    }
  }

  searchAddress(event: any) { // without type info
    if (event.key !== 'ArrowUp' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'Enter') {

      const ad1 = this.secondFormGroup.get('address1').value;

      if ((ad1 as string).length > 2) {
        const options = {
          params: new HttpParams().set('query', ad1)
            .append('type', 'address'),
          headers: new HttpHeaders().append('X-Algolia-Application-Id', environment.algoliaAppId)
            .append('X-Algolia-API-Key', environment.algoliaAPIKey)
        };
        this.options = [];
        this.httpClient.get('https://places-dsn.algolia.net/1/places/query', options)
          .subscribe((data: any) => {
            data.hits.forEach((e, i) => {
              const auxCity = {
                name: data.hits[i].locale_names.default[0],
                city: {
                  name: data.hits[i].city ? data.hits[i].city.default[0] : '',
                  admin: data.hits[i].administrative ? data.hits[i].administrative[0] : '',
                  country: data.hits[i].country ? data.hits[i].country.default : '',
                  postcode: data.hits[i].postcode ? data.hits[i].postcode[0] : ''
                },
                admin: data.hits[i].administrative ? data.hits[i].administrative[0] : '',
                country: data.hits[i].country ? data.hits[i].country.default : '',
                postcode: data.hits[i].postcode ? data.hits[i].postcode[0] : '',
                geo: data.hits[i]._geoloc ? data.hits[i]._geoloc : {}
              };
              if (data.hits[i].locale_names.default) {
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

  deletePhoto() {
    (document.getElementById('photo_profile') as HTMLInputElement).src = '../../../../assets/img/defaultProfileImg.png';
    this.secondFormGroup.controls['profile'].setValue(null);
  }

  getMaxYear() {
    const date = new Date;
    return date.getFullYear();
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
            // console.log(result);
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

  googleSignUp() {
    console.log('google Sign Up');
    window.location.href = environment.apiUrl + 'google';
  }

  gitHubSignUp() {
    // console.log(environment.apiUrl + 'auth/github?type=business');
     window.location.href = environment.apiUrl + 'auth/github?type=business';
  }


  linkedInSignUp() {
    console.log('linkedIn Sign Up');
    window.location.href = environment.apiUrl + 'auth/linkedin?type=business';
  }

  twitterSignUp() {
    console.log('twitter Sign Up');
    window.location.href = environment.apiUrl + 'auth/twitter';
  }
}
