import {Component, OnInit} from '@angular/core';
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
import {Router} from '@angular/router';
import {BusinessIndustries, BusinessSize} from '../../../../models/Business.model';
import {isStringNotANumber} from '../../../../models/Offer.model';

interface City {
  name: string;
  geo: {
    lat: number,
    lng: number
  };
}

interface Address {
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

  options: City[] = [];
  address: Address;
  fileEvent = null;
  file: any;

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
              private router: Router) {
    this.address = {ad1: null, ad2: null};
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
      SignupOffererComponent.maxMinDate.bind(this.thirdFormGroup),
    ]);


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

      if ((this.secondFormGroup.controls['address1'].value as City).geo === undefined ) {
        if (this.options.length > 0) {
          this.secondFormGroup.controls['address1'].setValue(this.options[0]);
        } else {
          const auxCity = {
            name: this.secondFormGroup.controls['address1'].value,
            geo: {
              lat: SignupOffererComponent.generateRandomLat(),
              lng: SignupOffererComponent.generateRandomLong()
            }
          };
          this.secondFormGroup.controls['address1'].setValue(auxCity);
        }
      }

      this.offerer = {
        'name': this.secondFormGroup.controls['businessName'].value,
        'password': this.secondFormGroup.controls['password'].value,
        'email': this.secondFormGroup.controls['email'].value,
        'address': this.secondFormGroup.controls['address1'].value.name,
        'cif': this.secondFormGroup.controls['vat'].value,
        'workField': this.secondFormGroup.controls['workField'].value,
        'year': new Date().toDateString(),
        'premium': '0',
        'companySize': '50',
        'bio': '',
        'img': this.file,
        'status': '0',
        'lng' : (this.secondFormGroup.controls['address1'].value as City).geo.lng,
        'lat' : (this.secondFormGroup.controls['address1'].value as City).geo.lat
      };

      // console.log(this.offerer);

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
        /*if (!this.dialogShown) {
          this.dialog.open(DialogErrorComponent, {
            data: {
              error: 'We had some issue creating your offer. Please try again later',
            }
          });
          this.dialogShown = true;
        }*/
      });
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

      const ad1 = this.secondFormGroup.get('address1').value;
      /*if (!ad1.first) {
        ad1 = this.secondFormGroup.get('address1').value;
        this.secondFormGroup.get('address2').setValue(null);
      } else {
        ad1 = ad1.first;
      }*/

      // const ad2 = this.secondFormGroup.get('address2').value;

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
                name: data.hits[i].locale_names.default
                  + ', ' + (data.hits[i].city ? data.hits[i].city.default : '')
                  + ', ' + (data.hits[i].postcode ? data.hits[i].postcode[0] : '')
                  + ', ' + (data.hits[i].country ? data.hits[i].country.default : ''),
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
}
