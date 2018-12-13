import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AdminService} from '../../admin.service';

@Component({
  selector: 'app-candidate-overview',
  templateUrl: './candidate-overview.component.html',
  styleUrls: ['./candidate-overview.component.scss']
})
export class CandidateOverviewComponent implements OnInit {
  isInEditMode = false;
  isPanelOpen = false;

  users: {
    id: number,
    name: string,
    index: number,
    email: string,
    state: string,
    premium: string,
    lastAccess: Date,
    signupDate: Date
  }[] = [
    {
      id: 0,
      name: 'Izadi Egizabal Alkorta',
      index: 64,
      email: 'hello@izadi.xyz',
      state: 'active',
      premium: 'premium',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      id: 1,
      name: 'Alba González Aller',
      index: 92,
      email: 'alba.g.aller@gmail.com',
      state: 'temporalBlocked',
      premium: 'free',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      id: 2,
      name: 'Carlos Aldaravi Coll',
      index: 88,
      email: 'caldaravi@gmail.com',
      state: 'active',
      premium: 'premium',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      id: 3,
      name: 'Marcos Urios Gómez',
      index: 95,
      email: 'marcosaurios@gmail.com',
      state: 'verPending',
      premium: 'free',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      id: 4,
      name: 'Flaviu Lucian Georgiu',
      index: 82,
      email: 'flaviu.georgiu97@gmail.com',
      state: 'active',
      premium: 'free',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
  ];
  states: { value: string, viewValue: string }[] = [
    {value: 'active', viewValue: 'Active'},
    {value: 'blocked', viewValue: 'Blocked'},
    {value: 'verPending', viewValue: 'Verification Pending'},
  ];
  subscriptions: { value: string, viewValue: string }[] = [
    {value: 'free', viewValue: 'Free'},
    {value: 'premium', viewValue: 'Premium'},
  ];

  userForm: FormGroup;


  constructor(private _formBuilder: FormBuilder, private _adminService: AdminService) {
  }

  ngOnInit() {

    this._adminService.getUser(0)
      .subscribe(
        (users: any) => {
          console.log(users);
          this.users = users;
        },
        (error) => {
          console.log(error);
        }
      );


    this.userForm = this._formBuilder.group({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.pattern('[a-zA-Z0-9_-ñ]{6,49}$')),
      'password2': new FormControl(''),
      'accountState': new FormControl(null, Validators.required),
      'premium': new FormControl(null, Validators.required),
    });

    this.userForm.controls['password2'].setValidators([
      Validators.required,
      this.samePassword.bind(this.userForm),
    ]);

    this.userForm.controls['password'].valueChanges.subscribe(value => {
      if (this.userForm.controls['password'].value != null) {
        this.userForm.controls['password2'].updateValueAndValidity();
      }
    });
  }


  samePassword(control: FormControl): { [s: string]: boolean } {
    const userForm: any = this;
    if (control.value !== userForm.controls['password'].value) {
      return {same: true};
    }
    return null;
  }

  edit(user) {
    this.isInEditMode = true;
    this.userForm.controls['name'].setValue(user.name);
    this.userForm.controls['email'].setValue(user.email);
    this.userForm.controls['accountState'].setValue(user.state);
    this.userForm.controls['premium'].setValue(user.premium);
  }


  updateApplicant(id) {
    this.isInEditMode = false;
    console.log(id);

    /*QUITAR los campos null del formulario*/
    this._adminService.updateUser(0, id, this.userForm.value)
      .subscribe(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
  }

}
