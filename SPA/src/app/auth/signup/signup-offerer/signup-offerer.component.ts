import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogErrorComponent} from '../dialog-error/dialog-error.component';
import {MatDialog, MatStepper} from '@angular/material';
import * as AuthActions from '../../store/auth.actions';
import {filter} from 'rxjs/operators';
import {Action, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import {AuthEffects} from '../../store/auth.effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

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

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  hide = false;
  offerer: any;

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
    {value: 0, viewValue: '1'},
    {value: 1, viewValue: '2'},
    {value: 2, viewValue: '3'},
    {value: 3, viewValue: '4'},
    {value: 4, viewValue: '5'},
  ];


  private dialogShown = false;


  constructor(private _formBuilder: FormBuilder,
              public dialog: MatDialog,
              private store$: Store<fromApp.AppState>, private authEffects$: AuthEffects,
              private httpClient: HttpClient) {
    this.address = {ad1: null, ad2: null};
  }

  ngOnInit() {


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
      'city': new FormControl(null, Validators.required),
      'province': new FormControl(null, Validators.required),
      'postalCode': new FormControl(null, Validators.required),
      'country': new FormControl(null, Validators.required),

    });

    this.thirdFormGroup = this._formBuilder.group({
      'about': new FormControl(),
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
    console.log(this.secondFormGroup.controls['address1'].value);

    if (this.secondFormGroup.status === 'VALID') {

      this.offerer = {
        'name': this.secondFormGroup.controls['businessName'].value,
        'password': this.secondFormGroup.controls['password'].value,
        'email': this.secondFormGroup.controls['email'].value,
        'address': this.secondFormGroup.controls['address1'].value,
        'cif': this.secondFormGroup.controls['vat'].value,
        'workField': this.secondFormGroup.controls['workField'].value,
        'year': '1997-03-17',
        'premium': '0',
        'companySize': '50'
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
              error: error.payload,
            }
          });
          this.dialogShown = true;
        }
      });
    }
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
            console.log('Consulta:');
            console.log(data);
            console.log('Valor de address:');
            console.log(this.secondFormGroup.get('address1').value);
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
}
