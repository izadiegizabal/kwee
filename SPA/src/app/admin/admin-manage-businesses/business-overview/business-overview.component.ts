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
    id: number,
    name: string,
    index: number,
    email: string,
    cif: string,
    workField: number,
    state: number,
    premium: number,
    lastAccess: Date,
    createdAt: Date
  }[] = [
    /*{
      id: 0,
      name: 'Google',
      index: 96,
      email: 'hello@google.com',
      cif: '25478963U',
      workField: 5,
      state: 'active',
      premium: 'elite',
      lastAccess: new Date('2018-11-29T21:24:00'),
      createdAt: new Date('2017-02-01T15:30:00')
    }*/
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
  states: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Active'},
    {value: 1, viewValue: 'Verification Pending'},
    {value: 2, viewValue: 'Validation Pending'},
    {value: 3, viewValue: 'Blocked'},
  ];
  subscriptions: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Free / Pay-as-you-go'},
    {value: 1, viewValue: 'Premium'},
    {value: 2, viewValue: 'Elite'},
  ];

  userForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _adminService: AdminService) {
  }

  ngOnInit() {

    this._adminService.getUser(1)
      .subscribe(
        (users: any) => {
          console.log(users);
          this.users = users.offerers;
          console.log(this.users);

        },
        (error) => {
           console.log(error);
        }
      );


    this.userForm = this._formBuilder.group({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'vat': new FormControl(null, Validators.required),
      'workField': new FormControl(null, Validators.required),
      'password': new FormControl('', Validators.pattern('[a-zA-Z0-9_-ñ]{6,49}$')),
      'password2': new FormControl(''),
      'accountState': new FormControl(null, Validators.required),
      'premium': new FormControl(null, Validators.required),
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
    premium: string;
    lastAccess: Date;
    signupDate: Date
  }) {
    this.isInEditMode = true;
    this.userForm.controls['name'].setValue(user.name);
    this.userForm.controls['email'].setValue(user.email);
    this.userForm.controls['vat'].setValue(user.vat);
    this.userForm.controls['accountState'].setValue(user.state);
    this.userForm.controls['premium'].setValue(user.premium);
    this.userForm.controls['workField'].setValue(user.workField);
  }

  getWorkField(workField: number) {
    return this.workFields.find(o => o.value === workField).viewValue;
  }


  updateOfferer(id) {
    this.isInEditMode = false;
    console.log(id);

    /*QUITAR los campos null del formulario*/
    /*this._adminService.updateUser(1, id, this.userForm.value)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );*/
  }
}
