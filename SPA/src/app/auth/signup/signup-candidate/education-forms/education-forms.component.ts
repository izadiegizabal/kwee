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
  selector: 'app-education-forms',
  templateUrl: './education-forms.component.html',
  styleUrls: ['./education-forms.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class EducationFormsComponent implements OnInit {

  @Output() formReady = new EventEmitter<FormArray>();
  educations: FormGroup;
  iskiled = 0;

  constructor(private _formBuilder: FormBuilder,
              public dialog: MatDialog) {

    this.iskiled = 0;

  }

  get formEducation() {
    return <FormArray>this.educations.get('education');
  }

  static maxMinDate(control: FormControl): { [s: string]: { [s: string]: boolean } } {
    const today = new Date();
    const mdate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDay());

    if (control.value > mdate) {
      return null;
    }
    return {'tooOld': {value: true}};
  }

  date(n: number) {
    return (<FormGroup>(<FormArray>this.educations.get('education')).controls[n]).controls.start;
  }

  dateEnd(n: number) {
    return (<FormGroup>(<FormArray>this.educations.get('education')).controls[n]).controls.end;
  }

  addEducationGroup(): FormGroup {
    return this._formBuilder.group({
      'title': new FormControl(null, Validators.required),
      'institution': new FormControl(null),
      'start': new FormControl(null, [EducationFormsComponent.maxMinDate]),
      'end': new FormControl(null, [EducationFormsComponent.maxMinDate]),
      'description': new FormControl(null)
    });
  }

  ngOnInit() {

    this.educations = this._formBuilder.group({
      'education': this._formBuilder.array([]),
    });

    this.formReady.emit(this.formEducation);
  }

  addEducation() {
    (<FormArray>this.educations.controls['education']).push(this.addEducationGroup());
    this.iskiled++;
    // console.log(this.formEducation.value);
  }

  deleteEducation(i) {
    (<FormArray>this.educations.controls['education']).removeAt(i);
    this.iskiled--;
  }

  onChange(e, s, dsds) {
    if (e.checked) {
      document.getElementById(`toExp${s}`).setAttribute('disabled', 'true');
      (<FormGroup>(<FormArray>this.educations.get('education')).controls[s]).controls.end.setValue(null);
      // console.log((<FormGroup>(<FormArray>this.educations.get('education')).controls[s]).controls.start);
    } else {
      document.getElementById(`toExp${s}`).removeAttribute('disabled');
    }
  }

  getEd(n: number) {
    return (<FormGroup>(<FormArray>this.educations.get('education')).controls[n]).controls;
  }

  onWhatEdS(index: number) {
    this.getEd(index).start.updateValueAndValidity();
    return false;
  }

  onWhatEdE(index: number, obj: any) {
    this.getEd(index).end.updateValueAndValidity();
    return false;
  }

  onDoneEd(index: number) {
    if (!(<FormArray>this.educations.controls['education']).controls[index].valid) {
      (<FormGroup>(<FormArray>this.educations.get('education')).controls[index]).controls.title.markAsTouched();
    } else {
      return true;
    }
    return false;
  }

  onCheck(istart, iend, index) {
    return !!((iend.value && !iend.disabled && istart.value && this.getEd(index).start.value && this.getEd(index).end.value) ||
      (iend.disabled && istart.value && this.getEd(index).start.value));
  }


  // Date handlers
  chosenYearHandler(normalizedYear: Moment, index: number) {
    this.date(index).setValue(moment());
    const ctrlValue = this.date(index).value;
    ctrlValue.year(normalizedYear.year());
    this.date(index).setValue(ctrlValue);
    this.getEd(index).start.markAsTouched();
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
    this.getEd(index).start.markAsTouched();
  }

  chosenMonthHandlerEnd(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>, index: number) {
    const ctrlValue = this.dateEnd(index).value;
    ctrlValue.month(normlizedMonth.month());
    this.dateEnd(index).setValue(ctrlValue);
    datepicker.close();
  }

}
