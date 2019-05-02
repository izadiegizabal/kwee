import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as ProfilesActions from '../../../profiles/store/profiles.actions';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import * as fromApp from '../../../store/app.reducers';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Address, SignupOffererComponent} from '../../../auth/signup/signup-offerer/signup-offerer.component';
import {environment} from '../../../../environments/environment';
import {OkDialogComponent} from '../../../shared/ok-dialog/ok-dialog.component';
import {DialogErrorComponent} from '../../../auth/signup/dialog-error/dialog-error.component';
import {DialogImageCropComponent} from '../../../auth/signup/dialog-image-crop/dialog-image-crop.component';
import {Observable} from 'rxjs';
import * as fromAuth from '../../../auth/store/auth.reducers';
import * as fromProfiles from '../../../profiles/store/profiles.reducers';
import {BusinessIndustries} from '../../../../models/Business.model';
import {isStringNotANumber} from '../../../../models/Offer.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-bs-account-settings',
  templateUrl: './bs-account-settings.component.html',
  styleUrls: ['./bs-account-settings.component.scss']
})
export class BsAccountSettingsComponent implements OnInit {

  // State variables
  offerer: any;
  token;
  authState: Observable<fromAuth.State>;
  profilesState: Observable<fromProfiles.State>;
  apiURL = environment.apiUrl;

  // Settings forms
  accountFormGroup: FormGroup;

  // Control variables
  dialogShown = false;
  hide = false;

  // Address control variables
  options = [];
  address: Address;
  fileEvent = null;
  file: any;
  cities = [];
  countries = [];

  workFields = Object
    .keys(BusinessIndustries)
    .filter(isStringNotANumber)
    .map(key => ({value: BusinessIndustries[key], viewValue: key}));

  constructor(private _formBuilder: FormBuilder,
              public dialog: MatDialog,
              private router: Router,
              private store$: Store<fromApp.AppState>,
              private httpClient: HttpClient) {
  }

  ngOnInit() {
    // Get profile
    this.authState = this.store$.pipe(select(state => state.auth));
    this.authState.subscribe((state) => {
      if (state && state.user && state.user.id > 0) {
        this.token = state.token;

        // If it's not a business redirect to home
        if (state.user.type !== 'business') {
          this.router.navigate(['/']);
        }

        this.store$.dispatch(new ProfilesActions.TryGetProfileBusiness({id: state.user.id}));
      }
    });

    // Initialise form
    this.accountFormGroup = this._formBuilder.group({
      'businessName': new FormControl(null, Validators.required),
      'vat': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'confEmail': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.pattern('[a-zA-Z0-9_-ñ]{6,49}$')),
      'password2': new FormControl(''),
      'workField': new FormControl(null),
      'address1': new FormControl(null),
      'city': new FormControl(null),
      'state': new FormControl(null),
      'postal': new FormControl(null),
      'country': new FormControl(),
      'profile': new FormControl(null) // profile image
    });

    this.accountFormGroup.controls['password2'].setValidators([
      this.samePassword.bind(this.accountFormGroup),
    ]);

    this.accountFormGroup.controls['confEmail'].setValidators([
      Validators.required,
      this.sameEmail.bind(this.accountFormGroup),
    ]);

    this.accountFormGroup.controls['password'].valueChanges.subscribe(value => {
      if (this.accountFormGroup.controls['password'].value != null && this.accountFormGroup.controls['password2'].value != null) {
        this.accountFormGroup.controls['password2'].updateValueAndValidity();
      }
    });


    this.accountFormGroup.controls['email'].valueChanges.subscribe(value => {
      if (this.accountFormGroup.controls['email'].value != null && this.accountFormGroup.controls['confEmail'].value != null) {
        this.accountFormGroup.controls['confEmail'].updateValueAndValidity();
      }
    });

    // Prepopulate form
    this.profilesState = this.store$.pipe(select(state => state.profiles));
    this.profilesState.subscribe((state) => {
        if (state.business) {
          this.offerer = state.business;
          this.accountFormGroup.controls['businessName'].setValue(state.business.name);
          this.accountFormGroup.controls['vat'].setValue(state.business.cif);
          this.accountFormGroup.controls['email'].setValue(state.business.email);
          this.accountFormGroup.controls['confEmail'].setValue(state.business.email);
          this.accountFormGroup.controls['workField'].setValue(state.business.workField);
        }
      }
    );
  }

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

  onSave() {
    this.dialogShown = false;
    // console.log(this.accountFormGroup);
    if (this.accountFormGroup.status === 'VALID') {

      let finalAddress = '';
      let lat, lng;
      if (this.accountFormGroup.controls['address1'].value) {
        finalAddress += this.accountFormGroup.controls['address1'].value.name ?
          this.accountFormGroup.controls['address1'].value.name : this.accountFormGroup.controls['address1'].value;
        if (this.accountFormGroup.controls['city'].value) {
          finalAddress += this.accountFormGroup.controls['city'].value.name ?
            ', ' + this.accountFormGroup.controls['city'].value.name : ', ' + this.accountFormGroup.controls['city'].value;
          if (this.accountFormGroup.controls['state'].value && this.accountFormGroup.controls['state'].value !== '') {
            finalAddress += ', ' + this.accountFormGroup.controls['state'].value;
            if (this.accountFormGroup.controls['postal'].value && this.accountFormGroup.controls['postal'].value !== '') {
              finalAddress += ', ' + this.accountFormGroup.controls['postal'].value;
              if (this.accountFormGroup.controls['country'].value && this.accountFormGroup.controls['country'].value !== '') {
                finalAddress += ', ' + this.accountFormGroup.controls['country'].value;
                lat = SignupOffererComponent.generateRandomLat();
                lng = SignupOffererComponent.generateRandomLong();
                if (this.accountFormGroup.controls['address1'].value.geo) {
                  lat = this.accountFormGroup.controls['address1'].value.geo.lat;
                  lng = this.accountFormGroup.controls['address1'].value.geo.lng;
                } else if (this.accountFormGroup.controls['city'].value.geo) {
                  lat = this.accountFormGroup.controls['city'].value.geo.lat;
                  lng = this.accountFormGroup.controls['city'].value.geo.lng;
                } else if (this.options.length > 0) {
                  lat = this.options[0].geo.lat;
                  lng = this.options[0].geo.lng;
                } else if (this.cities.length > 0 && this.cities[0].geo) {
                  lat = this.cities[0].geo.lat;
                  lng = this.cities[0].geo.lng;
                }
              } else {
                this.accountFormGroup.controls['country'].setErrors({'incorrect': true});
                return;
              }
            } else {
              this.accountFormGroup.controls['postal'].setErrors({'incorrect': true});
              return;
            }
          } else {
            this.accountFormGroup.controls['state'].setErrors({'incorrect': true});
            return;
          }
        } else {
          this.accountFormGroup.controls['city'].setErrors({'incorrect': true});
          return;
        }
      } else {
        if (this.accountFormGroup.controls['city'].value) {
          this.accountFormGroup.controls['address1'].setErrors({'incorrect': true});
          return;
        }
      }

      this.offerer = {
        ...this.offerer,
        'name': this.accountFormGroup.controls['businessName'].value,
        'email': this.accountFormGroup.controls['email'].value,
        'cif': this.accountFormGroup.controls['vat'].value,
        'workField': this.accountFormGroup.controls['workField'].value,
      };

      if (this.accountFormGroup.controls['password'].value) {
        this.offerer['password'] = this.accountFormGroup.controls['password'].value;
      }
      if (finalAddress !== '') {
        this.offerer['address'] = finalAddress;
      }
      if (this.file) {
        this.offerer['img'] = this.file;
      }
      if (lng && lat) {
        this.offerer['lng'] = lng;
        this.offerer['lat'] = lat;
      }

      // PUT modified business
      const options = {
        headers: new HttpHeaders().append('token', this.token)
          .append('Content-Type', 'application/json')
      };
      this.httpClient.put(environment.apiUrl + 'offerer', this.offerer, options)
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
    }
  }

  ///////////////////////////////////////////////////////////
  // Address Functions
  searchCity(event: any) {
    if (event.key !== 'ArrowUp' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'Enter') {

      const city = this.accountFormGroup.get('city').value;

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

  searchCountry(event: any) {
    if (event.key !== 'ArrowUp' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'Enter') {

      const country = this.accountFormGroup.get('country').value;

      if ((country as string) && (country as string).length > 2) {
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

      const ad1 = this.accountFormGroup.get('address1').value;

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

  displayFn(city?: any): string | undefined {
    return city ? city.name : undefined;
  }

  displayFnAddress(address?: any): string | undefined {
    return address ? address.name : undefined;
  }

  ///////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////
  // Photo Cropper
  deletePhoto() {
    (document.getElementById('photo_profile') as HTMLInputElement).src = '../../../../assets/img/defaultProfileImg.png';
    this.accountFormGroup.controls['profile'].setValue(null);
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

  ///////////////////////////////////////////////////////////

}
