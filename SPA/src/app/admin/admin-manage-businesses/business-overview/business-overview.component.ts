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
  updateuser: any;


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
    this.getUsers();

    this.userForm = this._formBuilder.group({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'vat': new FormControl(null, Validators.required),
      'workField': new FormControl(0, Validators.required),
      'password': new FormControl('', Validators.pattern('[a-zA-Z0-9_-ñ]{6,49}$')),
      'password2': new FormControl(''),
      'accountState': new FormControl(0, Validators.required),
      'premium': new FormControl(0, Validators.required),
    });

    this.userForm.controls['password2'].setValidators([
      this.samePassword.bind(this.userForm),
    ]);

    this.userForm.controls['password'].valueChanges.subscribe(value => {
      if (this.userForm.controls['password'].value !== null && this.userForm.controls['password'].value !== '') {
        this.userForm.controls['password2'].updateValueAndValidity();
      }
    });
  }

  samePassword(control: FormControl) {
    const userForm: any = this;
    if (control.value !== userForm.controls['password'].value) {
      return {diferent: true};
    }
    return null;
  }

  edit(user/*: {
    name: string;
    index: number;
    email: string;
    cif: string;
    workField: string;
    state: string;
    premium: string;
    lastAccess: Date;
    signupDate: Date
  }*/) {
    this.isInEditMode = true;
    this.userForm.controls['name'].setValue(user.name);
    this.userForm.controls['email'].setValue(user.email);
    this.userForm.controls['vat'].setValue(user.cif);
    // this.userForm.controls['accountState'].setValue(user.status);
    this.userForm.controls['premium'].setValue(user.premium);
    this.userForm.controls['workField'].setValue(user.workField);
  }

  getWorkField(workField: number) {
    return this.workFields.find(o => o.value === workField).viewValue;
  }


  getUsers() {
    this._adminService.getUser(1)
      .subscribe(
        (users: any) => {
          console.log(users);
          this.users = users.offerers;
          // console.log(this.users);

        },
        (error) => {
          console.log(error);
        }
      );
  }

  updateOfferer(id) {

    if (this.userForm.status === 'VALID') {
      this.isInEditMode = false;
      this.isPanelOpen = !this.isPanelOpen;

      this.updateuser = {
        'name': this.userForm.controls['name'].value,
        'email': this.userForm.controls['email'].value,
        'cif': this.userForm.controls['vat'].value,
        'workField': this.userForm.controls['workField'].value,
        // 'status': this.userForm.controls['accountState'].value,
        'premium': this.userForm.controls['premium'].value,
      };

      if (this.userForm.controls['password'].value !== null && this.userForm.controls['password'].value !== '') {
        this.updateuser['password'] = this.userForm.controls['password'].value;
      }

      // console.log(this.updateuser);

      this._adminService.updateUser(1, id, this.updateuser)
        .subscribe(
          (res) => {
            console.log(res);
            this.ngOnInit();
          },
          (error) => {
            console.log(error);
            this.ngOnInit();
          }
        );
    } else {
      console.log(this.userForm);
    }
  }


  deleteOfferer(id) {
    this._adminService.deleteUser(1, id)
      .subscribe(
        (res) => {
          console.log(res);
          this.ngOnInit();
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
