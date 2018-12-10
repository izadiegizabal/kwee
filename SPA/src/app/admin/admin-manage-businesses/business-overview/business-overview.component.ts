import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../admin.service';

@Component({
  selector: 'app-business-overview',
  templateUrl: './business-overview.component.html',
  styleUrls: ['./business-overview.component.scss']
})
export class BusinessOverviewComponent implements OnInit {
  isPanelOpen = false;
  isInEditMode = false;

  users: {
    name: string,
    index: number,
    email: string,
    vat: string,
    workField: number,
    state: string,
    subscription: string,
    lastAccess: Date,
    signupDate: Date
  }[] = [
    {
      name: 'Google',
      index: 96,
      email: 'hello@google.com',
      vat: '25478963U',
      workField: 5,
      state: 'active',
      subscription: 'elite',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    }
  ];

  workFields: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Software Engineering'},
    {value: 1, viewValue: 'Engineering Management'},
    {value: 2, viewValue: 'Design'},
    {value: 3, viewValue: 'Data Analytics'},
    {value: 4, viewValue: 'Developer Operations'},
    {value: 5, viewValue: 'Quality Assurance'},
    {value: 6, viewValue: 'Information Technology'},
    {value: 7, viewValue: 'Project Management'},
    {value: 9, viewValue: 'Product Management'},
  ];
  states: { value: string, viewValue: string }[] = [
    {value: 'active', viewValue: 'Active'},
    {value: 'verPending', viewValue: 'Verification Pending'},
    {value: 'valPending', viewValue: 'Validation Pending'},
    {value: 'blocked', viewValue: 'Blocked'},
  ];
  subscriptions: { value: string, viewValue: string }[] = [
    {value: 'free', viewValue: 'Free / Pay-as-you-go'},
    {value: 'premium', viewValue: 'Premium'},
    {value: 'elite', viewValue: 'Elite'},
  ];

  userForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _adminService: AdminService) {
  }

  ngOnInit() {

    /*his._adminService.getOfferers()
      .subscribe(
        (users: any) => {
          console.log(users);
          this.users = users;
        },
        (error) => {
           console.log(error);
        }
      );*/


    this.userForm = this._formBuilder.group({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'vat': new FormControl(null, Validators.required),
      'workField': new FormControl(null, Validators.required),
      'password': new FormControl('', Validators.pattern('[a-zA-Z0-9_-ñ]{6,49}$')),
      'password2': new FormControl(''),
      'accountState': new FormControl(null, Validators.required),
      'subscription': new FormControl(null, Validators.required),
    });

    this.userForm.controls['password2'].setValidators(
      this.samePassword.bind(this.userForm),
    );

    this.userForm.controls['password'].valueChanges.subscribe(value => {
      this.userForm.controls['password2'].updateValueAndValidity();
      console.log(this.userForm.controls['password2']);
    });
  }

  samePassword(control: FormControl) {
    const userForm: any = this;
    if (control.value !== userForm.controls['password'].value) {
      return {diferent: true};
    }
    return null;
  }

  edit(user: {
    name: string;
    index: number;
    email: string;
    vat: string;
    workField: string;
    state: string;
    subscription: string;
    lastAccess: Date;
    signupDate: Date
  }) {
    this.isInEditMode = true;
    this.userForm.controls['name'].setValue(user.name);
    this.userForm.controls['email'].setValue(user.email);
    this.userForm.controls['vat'].setValue(user.vat);
    this.userForm.controls['accountState'].setValue(user.state);
    this.userForm.controls['subscription'].setValue(user.subscription);
    this.userForm.controls['workField'].setValue(user.workField);
  }

  getWorkField(workField: number) {
    return this.workFields.find(o => o.value === workField).viewValue;
  }


  done() {
    console.log(this.userForm);
    console.log(this.userForm.controls['password2'].valid);

    if (this.userForm.valid) {
      this.isInEditMode = false;
    }
  }
}
