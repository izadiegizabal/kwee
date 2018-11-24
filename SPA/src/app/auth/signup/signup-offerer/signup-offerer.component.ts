import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-signup-offerer',
  templateUrl: './signup-offerer.component.html',
  styleUrls: ['./signup-offerer.component.scss',
    '../signup-candidate/signup-candidate.component.scss']
})
export class SignupOffererComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  workFields: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Designer'},
    {value: 1, viewValue: 'Front-end Developer'},
    {value: 2, viewValue: 'Back-end Developer'},
    {value: 3, viewValue: 'Tester'},
    {value: 4, viewValue: 'Product Manager'},
  ];

  companySizes: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: '1'},
    {value: 1, viewValue: '2'},
    {value: 2, viewValue: '3'},
    {value: 3, viewValue: '4'},
    {value: 4, viewValue: '5'},
  ];


  workField: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'a'},
    {value: 1, viewValue: 'b'},
    {value: 2, viewValue: 'c'},
    {value: 3, viewValue: 'd'},
    {value: 4, viewValue: 'e'},
  ];


  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      // secondCtrl: ['', Validators.required]
    });
  }

}
