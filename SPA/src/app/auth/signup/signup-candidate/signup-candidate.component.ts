import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-signup-candidate',
  templateUrl: './signup-candidate.component.html',
  styleUrls: ['./signup-candidate.component.scss']
})
export class SignupCandidateComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  roles: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Designer'},
    {value: 1, viewValue: 'Front-end Developer'},
    {value: 2, viewValue: 'Back-end Developer'},
    {value: 3, viewValue: 'Tester'},
    {value: 4, viewValue: 'Product Manager'},
  ];

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      // secondCtrl: ['', Validators.required]
    });
  }

}
