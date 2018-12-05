import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-candidate-overview',
  templateUrl: './candidate-overview.component.html',
  styleUrls: ['./candidate-overview.component.scss']
})
export class CandidateOverviewComponent implements OnInit {
  isInEditMode = false;
  isPanelOpen = false;

  users: {
    fullname: string,
    index: number,
    email: string,
    state: string,
    subscription: string,
    lastAccess: Date,
    signupDate: Date
  }[] = [
    {
      fullname: 'Izadi Egizabal Alkorta',
      index: 64,
      email: 'hello@izadi.xyz',
      state: 'active',
      subscription: 'premium',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      fullname: 'Alba González Aller',
      index: 92,
      email: 'alba.g.aller@gmail.com',
      state: 'temporalBlocked',
      subscription: 'free',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      fullname: 'Carlos Aldaravi Coll',
      index: 88,
      email: 'caldaravi@gmail.com',
      state: 'active',
      subscription: 'premium',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      fullname: 'Marcos Urios Gómez',
      index: 95,
      email: 'marcosaurios@gmail.com',
      state: 'verPending',
      subscription: 'free',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      fullname: 'Flaviu Lucian Georgiu',
      index: 82,
      email: 'flaviu.georgiu97@gmail.com',
      state: 'active',
      subscription: 'free',
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


  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.userForm = this._formBuilder.group({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.pattern('[a-zA-Z0-9_-ñ]{6,49}$')),
      'password2': new FormControl(''),
      'accountState': new FormControl(null, Validators.required),
      'subscription': new FormControl(null, Validators.required),
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
    this.userForm.controls['subscription'].setValue(user.subscription);
  }

}
