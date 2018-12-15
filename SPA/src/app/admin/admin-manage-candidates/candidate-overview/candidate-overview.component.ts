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
  updateuser: any;

  users: {
    id: number,
    name: string,
    index: number,
    email: string,
    state: number,
    premium: number,
    lastAccess: Date,
    createdAt: Date
  }[] = [
    /* {
       id: 0,
       name: 'Izadi Egizabal Alkorta',
       index: 64,
       email: 'hello@izadi.xyz',
       state: 0,
       premium: 0,
       lastAccess: new Date('2018-11-29T21:24:00'),
       createdAt: new Date('2017-02-01T15:30:00')
     },
     {
       id: 1,
       name: 'Alba González Aller',
       index: 92,
       email: 'alba.g.aller@gmail.com',
       state: 1,
       premium: 1,
       lastAccess: new Date('2018-11-29T21:24:00'),
       createdAt: new Date('2017-02-01T15:30:00')
     },
     {
       id: 2,
       name: 'Carlos Aldaravi Coll',
       index: 88,
       email: 'caldaravi@gmail.com',
       state: 0,
       premium: 0,
       lastAccess: new Date('2018-11-29T21:24:00'),
       createdAt: new Date('2017-02-01T15:30:00')
     },
     {
       id: 3,
       name: 'Marcos Urios Gómez',
       index: 95,
       email: 'marcosaurios@gmail.com',
       state: 2,
       premium: 0,
       lastAccess: new Date('2018-11-29T21:24:00'),
       createdAt: new Date('2017-02-01T15:30:00')
     },
     {
       id: 4,
       name: 'Flaviu Lucian Georgiu',
       index: 82,
       email: 'flaviu.georgiu97@gmail.com',
       state: 2,
       premium: 0,
       lastAccess: new Date('2018-11-29T21:24:00'),
       createdAt: new Date('2017-02-01T15:30:00')
     },*/
  ];
  states: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Active'},
    {value: 1, viewValue: 'Blocked'},
    {value: 2, viewValue: 'Verification Pending'},
  ];
  subscriptions: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Free'},
    {value: 1, viewValue: 'Premium'},
  ];

  userForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _adminService: AdminService) {
  }

  ngOnInit() {

    this.getUsers();

    this.userForm = this._formBuilder.group({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
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


  samePassword(control: FormControl): { [s: string]: boolean } {
    const userForm: any = this;
    if (control.value !== userForm.controls['password'].value) {
      return {same: true};
    }
    return null;
  }

  getUsers() {
    this._adminService.getUser(0)
      .subscribe(
        (users: any) => {
          console.log(users);
          this.users = users.applicants;
          // console.log(this.users);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  edit(user) {
    this.isInEditMode = true;
    this.userForm.controls['name'].setValue(user.name);
    this.userForm.controls['email'].setValue(user.email);
    // this.userForm.controls['accountState'].setValue(user.state);
    this.userForm.controls['premium'].setValue(user.premium);
  }


  updateApplicant(id) {

    if (this.userForm.status === 'VALID') {
      this.isInEditMode = false;
      this.isPanelOpen = !this.isPanelOpen;

      this.updateuser = {
        'name': this.userForm.controls['name'].value,
        'email': this.userForm.controls['email'].value,
        // 'status': this.userForm.controls['accountState'].value,
        'premium': this.userForm.controls['premium'].value,
      };

      if (this.userForm.controls['password'].value !== null && this.userForm.controls['password'].value !== '') {
        this.updateuser['password'] = this.userForm.controls['password'].value;
      }

      // console.log(this.updateuser);

      this._adminService.updateUser(0, id, this.updateuser)
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


  deleteApplicant(id) {
    this._adminService.deleteUser(0, id)
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
