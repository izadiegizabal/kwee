import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material';
import {environment} from '../../../environments/environment';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromOffer from '../offer-detail/store/offer.reducers';
import {OfferEffects} from '../offer-detail/store/offer.effects';
import * as OfferActions from '../offer-detail/store/offer.actions';
import {filter, first} from 'rxjs/operators';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ChangeEvent} from '@ckeditor/ckeditor5-angular/ckeditor.component';
import {
  ContractType,
  isStringNotANumber,
  JobDurationUnit,
  SalaryFrequency,
  SeniorityLevel,
  WorkLocationType
} from '../../../models/Offer.model';
import {Title} from '@angular/platform-browser';


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


  public Editor = ClassicEditor;
  public Config = {
    toolbar: ['heading', '|', 'bold', 'italic', 'link',
      'bulletedList', 'numberedList', 'blockQuote',
      'insertTable', 'undo', 'redo']
  };
  public DataDesc = '<p>Your text...</p>';
  public DataReq = '<p>Your text...</p>';
  public DataRes = '<p>Your text...</p>';

  authState: any;
  token;
  edit: boolean;
  editOffer: Number = -1;
  offer: any;

  form: FormGroup;
  iskill = 0;
  options: City[] = [];
  durationReq: boolean;

  offerState: Observable<fromOffer.State>;

  durationUnit = Object.keys(JobDurationUnit)
    .filter(isStringNotANumber)
    .map(key => ({value: JobDurationUnit[key], viewValue: key}));
  workLocation = Object.keys(WorkLocationType)
    .filter(isStringNotANumber)
    .map(key => ({value: WorkLocationType[key], viewValue: key}));
  contractType = Object.keys(ContractType)
    .filter(isStringNotANumber)
    .map(key => ({value: ContractType[key], viewValue: key}));
  salaryFrequency = Object.keys(SalaryFrequency)
    .filter(isStringNotANumber)
    .map(key => ({value: SalaryFrequency[key], viewValue: key}));
  seniority = Object.keys(SeniorityLevel)
    .filter(isStringNotANumber)
    .map(key => ({value: SeniorityLevel[key], viewValue: key}));

  auxCurrencies: any[];

  private dialogShown = false;

  constructor(
    private titleService: Title,
    private _formBuilder: FormBuilder,
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
    this.titleService.setTitle('Kwee - Create Offer');
    this.authState = this.store$.pipe(select('auth'));
    this.authState.pipe(
      select((s: { token: string }) => s.token)
    ).subscribe(
      (token) => {
        this.token = token;
      });

    const params = this.activatedRoute.snapshot.params;

    if (Number(params.id)) {
      console.log(Number(params.id));
      this.edit = true;
      this.editOffer = Number(params.id);
      this.store$.dispatch(new OfferActions.TryGetOffer({id: params.id}));
      this.offerState = this.store$.pipe(select(state => state.offer));
      this.offerState.pipe(
        first()
      ).subscribe(
        (data: { offer: any }) => {
          console.log(data.offer);
          this.offer = data.offer;
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

  public onChangeDescription({editor}: ChangeEvent) {
    this.form.controls['description'].setValue(editor.getData());
    if (this.form.controls['description'].value === '<p>&nbsp;</p>') {
      this.form.controls['description'].setValue(null);
    }
  }

  public onChangeRequirements({editor}: ChangeEvent) {
    this.form.controls['requirements'].setValue(editor.getData());
    if (this.form.controls['requirements'].value === '<p>&nbsp;</p>') {
      this.form.controls['requirements'].setValue(null);
    }
  }

  public onChangeResponsabilities({editor}: ChangeEvent) {
    this.form.controls['responsabilities'].setValue(editor.getData());
    if (this.form.controls['responsabilities'].value === '<p>&nbsp;</p>') {
      this.form.controls['responsabilities'].setValue(null);
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

    if (this.offer) {
      this.DataDesc = this.offer.description;
      this.DataReq = this.offer.requeriments;
      this.DataRes = this.offer.responsabilities;
      this.titleService.setTitle('Kwee - Edit Offer "' + this.offer.title + '"');
    }


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
      'salaryFrequency': new FormControl(this.offer ? this.offer.salaryFrecuency : null, Validators.required),
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
        'datePublished': new Date(),
        'dateStart': this.form.controls['dateStart'].value,
        'dateEnd': this.form.controls['dateEnd'].value,
        'location': (this.form.controls['location'].value as City).name
          ? (this.form.controls['location'].value as City).name
          : this.form.controls['location'].value,
        'salaryAmount': this.form.controls['salary'].value,
        'salaryFrequency': this.form.controls['salaryFrequency'].value,
        'salaryCurrency': this.form.controls['salaryCurrency'].value,
        'workLocation': this.form.controls['workLocation'].value,
        'seniority': this.form.controls['seniority'].value,
        'maxApplicants': this.form.controls['maxApplicants'].value,
        'duration': this.form.controls['duration'].value ? this.form.controls['duration'].value : '0',
        'durationUnit': this.form.controls['durationUnit'].value ? this.form.controls['durationUnit'].value : '0',
        'contractType': this.form.controls['contractType'].value,
        'isIndefinite': this.form.controls['isIndefinite'].value ? 'true' : 'false',
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
    // document.getElementById(`dnum`).setAttribute('disabled', 'true');
    // document.getElementById(`dtime`).setAttribute('disabled', 'true');
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
