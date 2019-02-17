import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material';
import {environment} from '../../../environments/environment';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import {Router} from '@angular/router';


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

  form: FormGroup;
  iskill = 0;
  options: City[] = [];
  durationReq: boolean;

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

  constructor(private _formBuilder: FormBuilder,
              private http: HttpClient,
              public dialog: MatDialog,
              private store$: Store<fromApp.AppState>,
              private router: Router) {

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

  get formSkills() {
    return <FormArray>this.form.get('skills');
  }

  static maxMinDate(control: FormControl): { [s: string]: { [s: string]: boolean } } {
    const today = new Date();
    const mdate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDay());

    if (control.value > mdate && control.value >= today) {
      return null;
    }
    return {'tooOld': {value: true}};
  }

  getJSON(): Observable<any> {
    return this.http.get('./assets/CurrenciesISO.json');
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


    this.form = this._formBuilder.group({
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      // ---------------------------------------------------------------------
      'datePublished': new FormControl(null),
      // ---------------------------------------------------------------------
      'dateStart': new FormControl(null, Validators.required),
      'dateEnd': new FormControl(null, Validators.required),
      'location': new FormControl(null, Validators.required),
      'salary': new FormControl(null, Validators.required),
      'salaryFrecuency': new FormControl(null, Validators.required),
      'salaryCurrency': new FormControl(null, Validators.required),
      'seniority': new FormControl(null, Validators.required),
      'maxApplicants': new FormControl(null, Validators.required),
      'duration': new FormControl(null),
      'durationUnit': new FormControl(null),
      'contractType': new FormControl(null, Validators.required),
      'isIndefinite': new FormControl(null),
      'workLocation': new FormControl(null, Validators.required),
      'skills': new FormArray([new FormControl(null)]),
      'requirements': new FormControl(null),
      'responsabilities': new FormControl(null)
    });

    this.form.controls['dateStart'].setValidators([
      Validators.required,
      OfferCreateComponent.maxMinDate.bind(this.form),
    ]);

    this.form.controls['dateEnd'].setValidators([
      Validators.required,
      OfferCreateComponent.maxMinDate.bind(this.form),
    ]);
  }

  onSave() {
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

      this.http.post(environment.apiUrl + 'offer',
        {
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
        }
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

  onChange(e) {
    if (e.checked) {
      document.getElementById(`dnum`).setAttribute('disabled', 'true');
      document.getElementById(`dtime`).setAttribute('disabled', 'true');
      this.form.get('duration').setValue(null);
      this.form.get('durationUnit').setValue(null);
      this.form.get('durationUnit').disable();
      this.form.get('duration').disable();
      this.durationReq = false;
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
