import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DialogErrorComponent} from '../../auth/signup/dialog-error/dialog-error.component';
import {MatDialog} from '@angular/material';
import {environment} from '../../../environments/environment';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromOffer from '../offer-detail/store/offer.reducers';
import {OfferEffects} from '../offer-detail/store/offer.effects';
import * as OfferActions from '../offer-detail/store/offer.actions';
import {filter, first} from 'rxjs/operators';


interface City {
  name: string;
  geo: {
    lat: number,
    lng: number
  };
}

@Component({
  selector: 'app-offer-create',
  templateUrl: './offer-create.component.html',
  styleUrls: ['./offer-create.component.scss']
})
export class OfferCreateComponent implements OnInit {

  authState: any;
  token;
  edit: boolean;
  editOffer: Number = -1;
  offer: any;

  form: FormGroup;
  iskill = 0;
  options: City[] = [];
  durationReq: boolean;

  offerSkills: [' '];
  offerState: Observable<fromOffer.State>;

  salaryFrecuency: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Hour'},
    {value: 1, viewValue: 'Month'},
    {value: 2, viewValue: 'Year'},
    {value: 3, viewValue: 'Whole Project'}
  ];

  workLocation: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'OnSite'},
    {value: 1, viewValue: 'Remote'},
    {value: 2, viewValue: 'Partially Remote'},
  ];

  seniority: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Entry-Junior'},
    {value: 1, viewValue: 'Intermediate'},
    {value: 2, viewValue: 'Senior'},
    {value: 3, viewValue: 'Lead'}
  ];

  durationUnit: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Days'},
    {value: 1, viewValue: 'Months'},
    {value: 2, viewValue: 'Years'}
  ];

  contractType: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Full-Time'},
    {value: 1, viewValue: 'Part-Time'},
    {value: 2, viewValue: 'Internship'},
    {value: 3, viewValue: 'End of Degree Project'}
  ];

  salaryCurrencies: { value: string }[];

  auxCurrencies: any[];

  private dialogShown = false;

  static maxMinDate(control: FormControl): { [s: string]: { [s: string]: boolean } } {
    const today = new Date();
    const mdate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDay());

    if (control.value > mdate && control.value >= today) {
      return null;
    }
    return {'tooOld': {value: true}};
  }

  constructor(private _formBuilder: FormBuilder,
              private http: HttpClient,
              public dialog: MatDialog,
              private store$: Store<fromApp.AppState>,
              private router: Router,
              private offerEffects$: OfferEffects,
              private activatedRoute: ActivatedRoute) {

    this.iskill = 0;
    this.durationReq = true;
    this.options = [];
    this.getJSON().subscribe(data => {
      const evrp = Object.keys(data);
      const gr = [];
      for (const prop of evrp) {
        gr.push(data[prop]);
      }
      this.auxCurrencies = gr;
    });
  }

  getJSON(): Observable<any> {
    return this.http.get('./assets/CurrenciesISO.json');
  }

  get formSkills() {
    return <FormArray>this.form.get('skills');
  }

  ngOnInit() {
    this.authState = this.store$.pipe(select('auth'));
    this.authState.pipe(
      // @ts-ignore
      select(s => s.token)
    ).subscribe(
      (token) => {
        this.token = token;
      });

    const params = this.activatedRoute.snapshot.params;

    if (Number(params.id)) {
      this.editOffer = Number(params.id);
      this.store$.dispatch(new OfferActions.TryGetOffer({id: params.id}));
      this.offerState = this.store$.pipe(select(state => state.offer));
      this.offerState.pipe(
        first()
      ).subscribe(
        (data: { offer: { offer: any } }) => {
          console.log(data.offer.offer);
          this.offer = data.offer.offer;
          this.initForm();
        });
      this.offerEffects$.offerGetoffer.pipe(
        filter((action: Action) => action.type === OfferActions.OPERATION_ERROR)
      ).subscribe((error: { payload: any, type: string }) => {
        this.router.navigate(['/']);
      });
    } else {
      this.edit = false;
      this.initForm();
      // this.router.navigate(['/']);
    }

  }

  initForm() {
    // (offerState | async).offer.offer.isIndefinite
    const loc = {
      name: this.offer ? this.offer.location : null,
      geo: {
        lat: this.offer ? this.offer.lat : null,
        lng: this.offer ? this.offer.lng : null
      }
    };
    this.form = this._formBuilder.group({
      'title': new FormControl(this.offer ? this.offer.title : null, Validators.required),
      'description': new FormControl(this.offer ? this.offer.description : null, Validators.required),
      // ---------------------------------------------------------------------
      'datePublished': new FormControl(null),
      // ---------------------------------------------------------------------
      'dateStart': new FormControl(this.offer ? this.offer.dateStart : null, Validators.required),
      'dateEnd': new FormControl(this.offer ? this.offer.dateEnd : null, Validators.required),
      'location': new FormControl(loc, Validators.required),
      'salary': new FormControl(this.offer ? this.offer.salaryAmount : null, Validators.required),
      'salaryFrecuency': new FormControl(this.offer ? this.offer.salaryFrecuency : null, Validators.required),
      'salaryCurrency': new FormControl(this.offer ? this.offer.salaryCurrency : null, Validators.required),
      'seniority': new FormControl(this.offer ? this.offer.seniority : null, Validators.required),
      'maxApplicants': new FormControl(this.offer ? this.offer.maxApplicants : null, Validators.required),
      'duration': new FormControl(this.offer ? this.offer.duration : null),
      'durationUnit': new FormControl(this.offer ? this.offer.durationUnit : null),
      'contractType': new FormControl(this.offer ? this.offer.contractType : null, Validators.required),
      'isIndefinite': new FormControl(this.offer ? !this.offer.isIndefinite : null),
      'workLocation': new FormControl(this.offer ? this.offer.workLocation : null, Validators.required),
      'skills': new FormArray(this.getSkills(this.offer ? this.offer.skills : null)),
      'requirements': new FormControl(this.offer ? this.offer.requeriments : null),
      'responsabilities': new FormControl(this.offer ? this.offer.responsabilities : null)
    });

    if (this.offer && !this.offer.isIndefinite) {
      this.disableDuration();
    }

    this.form.controls['dateStart'].setValidators([
      Validators.required,
      OfferCreateComponent.maxMinDate.bind(this.form),
    ]);

    this.form.controls['dateEnd'].setValidators([
      Validators.required,
      OfferCreateComponent.maxMinDate.bind(this.form),
    ]);
  }

  getSkills(skills): FormControl[] {
    if (skills === null) {
      return [new FormControl(null)];
    } else {
      const arr = (skills as String).split(',');
      const arrAux = [];
      arr.forEach(e => {
        arrAux.push(new FormControl(e));
      });
      return arrAux;
    }
  }

  onSave(create: boolean) {
    this.dialogShown = false;
    if (this.form.status === 'VALID') {

      console.log(this.form);
      console.log(this.token);

      const auxSkills = (this.form.controls['skills'].value as Array<string>).filter(e => {
        return (e !== null);
      });
      const skills = auxSkills.join(',');

      const options = {
        headers: new HttpHeaders().append('token', this.token)
          .append('Content-Type', 'application/json')
      };

      console.log(options);

      const obj = {
        'status': '0',
        'title': this.form.controls['title'].value,
        'description': this.form.controls['description'].value,
        'datePublished': (new Date()).toDateString(),
        'dateStart': this.form.controls['dateStart'].value,
        'dateEnd': this.form.controls['dateEnd'].value,
        'location': (this.form.controls['location'].value as City).name
          ? (this.form.controls['location'].value as City).name
          : this.form.controls['location'].value,
        'salaryAmount': this.form.controls['salary'].value,
        'salaryFrecuency': this.form.controls['salaryFrecuency'].value,
        'salaryCurrency': this.form.controls['salaryCurrency'].value,
        'workLocation': this.form.controls['workLocation'].value,
        'seniority': this.form.controls['seniority'].value,
        'maxApplicants': this.form.controls['maxApplicants'].value,
        'duration': this.form.controls['duration'].value ? this.form.controls['duration'].value : '0',
        'durationUnit': this.form.controls['durationUnit'].value ? this.form.controls['durationUnit'].value : '0',
        'contractType': this.form.controls['contractType'].value,
        'isIndefinite': this.form.controls['isIndefinite'].value ? '0' : '1',
        'currentApplications': '0',
        'responsabilities': this.form.controls['responsabilities'].value,
        'requeriments': this.form.controls['requirements'].value,
        'skills': skills
      };

      if (create) {
        this.http.post(environment.apiUrl + 'offer',
          obj
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
      } else {
        this.http.put(environment.apiUrl + 'offer/' + this.editOffer,
          obj
          , options)
          .subscribe((data: any) => {
            console.log(data);
            this.router.navigate(['/']);
          }, (error: any) => {
            console.log(error);
          });
      }


      /*if (!this.dialogShown) {
        this.dialog.open(DialogErrorComponent, {
          data: {
            error: 'Error al crear oferta. Inténtalo más tarde',
          }
        });
        this.dialogShown = true;
      }*/

    } else {
      for (const i of Object.keys(this.form.controls)) {
        this.form.controls[i].markAsTouched();
      }
    }

  }

  add_skill() {
    (<FormArray>this.form.controls['skills']).push(new FormControl(null));
    this.iskill++;
    // console.log(this.formSkills.length);
    setTimeout(() => {
      document.getElementById(`skill${this.iskill}`).focus();
    }, 1);
  }

  deleteSkill(i) {
    (<FormArray>this.form.controls['skills']).removeAt(i);
    this.iskill--;
  }

  disableDuration() {
    document.getElementById(`dnum`).setAttribute('disabled', 'true');
    document.getElementById(`dtime`).setAttribute('disabled', 'true');
    this.form.get('duration').setValue(null);
    this.form.get('durationUnit').setValue(null);
    this.form.get('durationUnit').disable();
    this.form.get('duration').disable();
    this.durationReq = false;
  }

  onChange(e) {
    if (e.checked) {
      this.disableDuration();
    } else {
      document.getElementById(`dnum`).removeAttribute('disabled');
      document.getElementById(`dtime`).removeAttribute('disabled');
      this.form.get('durationUnit').enable();
      this.form.get('duration').enable();
      this.durationReq = true;
    }
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
        this.http.get('https://places-dsn.algolia.net/1/places/query', options)
          .subscribe((data: any) => {
            // console.log(data);
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

}
