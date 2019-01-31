import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
// tslint:disable-next-line:no-duplicate-imports
import * as _moment from 'moment';
import {Moment} from 'moment';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-experience-forms',
  templateUrl: './experience-forms.component.html',
  styleUrls: ['./experience-forms.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ExperienceFormsComponent implements OnInit {

  @Output() formReady = new EventEmitter<FormArray>();
  experiences: FormGroup;
  iskilex = 0;

  constructor(private _formBuilder: FormBuilder,
              public dialog: MatDialog) {

    this.iskilex = 0;

  }

  get formExperience() {
    return <FormArray>this.experiences.get('experience');
  }

  static maxMinDate(control: FormControl): { [s: string]: { [s: string]: boolean } } {
    const today = new Date();
    const mdate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDay());

    if (control.value > mdate) {
      return null;
    }
    return {'tooOld': {value: true}};
  }

  static maxDate(control: FormControl): { [s: string]: boolean } {
    const today = new Date();

    if (control.value < today) {
      return null;
    }
    return {'tooYoung': true};
  }

  date(n: number) {
    return (<FormGroup>(<FormArray>this.experiences.get('experience')).controls[n]).controls.start;
  }

  dateEnd(n: number) {
    return (<FormGroup>(<FormArray>this.experiences.get('experience')).controls[n]).controls.end;
  }

  addExperienceGroup(): FormGroup {
    return this._formBuilder.group({
      'title': new FormControl(null, Validators.required),
      'company': new FormControl(null),
      'start': new FormControl(null, [ExperienceFormsComponent.maxMinDate, ExperienceFormsComponent.maxDate]),
      'end': new FormControl(null, [ExperienceFormsComponent.maxMinDate, ExperienceFormsComponent.maxDate]),
      'description': new FormControl(null)
    });
  }

  ngOnInit() {

    this.experiences = this._formBuilder.group({
      'experience': this._formBuilder.array([]),
    });

    this.formReady.emit(this.formExperience);
  }

  addExperience() {
    (<FormArray>this.experiences.controls['experience']).push(this.addExperienceGroup());
    this.iskilex++;
    console.log(this.formExperience.value);
  }

  deleteExperience(i) {
    (<FormArray>this.experiences.controls['experience']).removeAt(i);
    this.iskilex--;
  }

  onChange(e, s, dsds) {
    if (e.checked) {
      document.getElementById(`toExp${s}`).setAttribute('disabled', 'true');
      (<FormGroup>(<FormArray>this.experiences.get('experience')).controls[s]).controls.end.setValue(null);
      console.log((<FormGroup>(<FormArray>this.experiences.get('experience')).controls[s]).controls.start);

    } else {
      document.getElementById(`toExp${s}`).removeAttribute('disabled');
    }
  }

  getEx(n: number) {
    return (<FormGroup>(<FormArray>this.experiences.get('experience')).controls[n]).controls;
  }

  onWhatExS(index: number, obj: any) {
    this.getEx(index).start.updateValueAndValidity();
    return false;
  }

  onWhatExE(index: number, obj: any) {
    this.getEx(index).end.updateValueAndValidity();
    return false;
  }

  onDoneEx(index: number) {
    if (!(<FormArray>this.experiences.controls['experience']).controls[index].valid) {
      (<FormGroup>(<FormArray>this.experiences.get('experience')).controls[index]).controls.title.markAsTouched();
    } else {
      return true;
    }
    return false;
  }

  onCheck(istart, iend, index) {
    return !!((iend.value && !iend.disabled && istart.value && this.getEx(index).start.value && this.getEx(index).end.value) ||
      (iend.disabled && istart.value && this.getEx(index).start.value));
  }


  // Date handlers
  chosenYearHandler(normalizedYear: Moment, index: number) {
    this.date(index).setValue(moment());
    const ctrlValue = this.date(index).value;
    ctrlValue.year(normalizedYear.year());
    this.date(index).setValue(ctrlValue);
    this.getEx(index).start.markAsTouched();
  }

  chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>, index: number) {
    const ctrlValue = this.date(index).value;
    ctrlValue.month(normlizedMonth.month());
    this.date(index).setValue(ctrlValue);
    datepicker.close();
  }

  chosenYearHandlerEnd(normalizedYear: Moment, index: number) {
    this.dateEnd(index).setValue(moment());
    const ctrlValue = this.dateEnd(index).value;
    ctrlValue.year(normalizedYear.year());
    this.dateEnd(index).setValue(ctrlValue);
    this.getEx(index).end.markAsTouched();
  }

  chosenMonthHandlerEnd(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>, index: number) {
    const ctrlValue = this.dateEnd(index).value;
    ctrlValue.month(normlizedMonth.month());
    this.dateEnd(index).setValue(ctrlValue);
    datepicker.close();
  }
}
