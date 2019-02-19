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
import {Observable} from 'rxjs';
import {DialogImageCropComponent} from '../dialog-image-crop/dialog-image-crop.component';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';

interface City {
  first: string;
  second: string;
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

  workFields: { value: number, viewValue: string }[] = [
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

  companySizes: { value: number, viewValue: string }[] = [
    {value: 10, viewValue: '10'},
    {value: 50, viewValue: '50'},
    {value: 100, viewValue: '100'},
    {value: 1000, viewValue: '1000'},
  ];


  private dialogShown = false;

  static maxMinDate(control: FormControl): { [s: string]: { [s: string]: boolean } } {
    const today = new Date();
    const mdate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDay());

    if (control.value > mdate) {
      return null;
    }
    return {'tooOld': {value: true}};
  }


  constructor(private _formBuilder: FormBuilder,
              public dialog: MatDialog,
              private store$: Store<fromApp.AppState>, private authEffects$: AuthEffects,
              private httpClient: HttpClient,
              private router: Router) {
    this.address = {ad1: null, ad2: null};
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
      'address2': new FormControl(null),
      'profile': new FormControl(null)
    });

    this.thirdFormGroup = this._formBuilder.group({
      'about': new FormControl(),
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

    this.secondFormGroup.controls['address1'].valueChanges.subscribe(value => {
      if (this.secondFormGroup.controls['address1'].value) {
        const aux = this.secondFormGroup.controls['address1'].value;
        if (aux.second) {
          this.secondFormGroup.controls['address2'].setValue(aux.second);
        }
      }
    });

    this.thirdFormGroup.controls['year'].setValidators([
      SignupOffererComponent.maxMinDate.bind(this.thirdFormGroup),
    ]);

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

      this.offerer = {
        'name': this.secondFormGroup.controls['businessName'].value,
        'password': this.secondFormGroup.controls['password'].value,
        'email': this.secondFormGroup.controls['email'].value,
        'address': this.secondFormGroup.controls['address1'].value.first,
        'cif': this.secondFormGroup.controls['vat'].value,
        'workField': this.secondFormGroup.controls['workField'].value,
        'year': new Date().toDateString(),
        'premium': '0',
        'companySize': '50',
        'bio': '',
        'img': this.file,
        'status': '0'
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
      'about' : this.thirdFormGroup.controls['about'].value,
      'website' : this.thirdFormGroup.controls['website'].value,
      'companySize' : this.thirdFormGroup.controls['companySize'].value,
      'year' : this.thirdFormGroup.controls['year'].value
    };

    const options = {
      headers: new HttpHeaders().append('token', this.token)
        .append('Content-Type', 'application/json')
    };
    this.httpClient.put(environment.apiUrl + 'offerer',
      update
      , options)
      .subscribe((data: any) => {
        console.log(data);
        this.router.navigate(['/']);
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
  }

  displayFn(city?: City): string | undefined {
    return city ? city.first : undefined;
  }

  onKey(event: any) { // without type info
    // q=benidorm&format=json&addressdetails=1&limit=5&polygon_svg=1

    if (event.key !== 'ArrowUp' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'Enter') {

      let ad1 = this.secondFormGroup.get('address1').value;
      if (!ad1.first) {
        ad1 = this.secondFormGroup.get('address1').value;
        this.secondFormGroup.get('address2').setValue(null);
      } else {
        ad1 = ad1.first;
      }

      const ad2 = this.secondFormGroup.get('address2').value;

      if ((ad1 as string).length > 2) {
        const options = {
          params: new HttpParams().set('query', ad1 + ', ' + ad2)
            .append('type', 'address'),
          headers: new HttpHeaders().append('X-Algolia-Application-Id', environment.algoliaAppId)
            .append('X-Algolia-API-Key', environment.algoliaAPIKey)
        };
        this.options = [];
        this.httpClient.get('https://places-dsn.algolia.net/1/places/query', options)
          .subscribe((data: any) => {
            data.hits.forEach((e, i) => {
              const auxCity = {
                first: data.hits[i].locale_names.default
                  + ', ' + (data.hits[i].city ? data.hits[i].city.default : ''),
                second: data.hits[i].administrative
                  + ', ' + (data.hits[i].postcode ? data.hits[i].postcode[0] : '')
                  + ', ' + (data.hits[i].country ? data.hits[i].country.default : ''),
                geo: data.hits[i]._geoloc ? data.hits[i]._geoloc : {}
              };
              if (data.hits[i].locale_names.default) {
                if (!this.options.some(element => element.first === auxCity.first)) {
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
    (document.getElementById('photo_profile') as HTMLInputElement).src = '../../../../assets/defaut_profile.png';
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
            console.log(result);
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
