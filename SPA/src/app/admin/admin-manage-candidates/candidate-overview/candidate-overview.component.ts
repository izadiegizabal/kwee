import {Component, OnInit} from '@angular/core';

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
      subscription: 'Premium',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      fullname: 'Alba González Aller',
      index: 92,
      email: 'alba.g.aller@gmail.com',
      state: 'active',
      subscription: 'free',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      fullname: 'Carlos Aldaravi Coll',
      index: 88,
      email: 'caldaravi@gmail.com',
      state: 'active',
      subscription: 'free',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      fullname: 'Marcos Urios Gómez',
      index: 95,
      email: 'marcosaurios@gmail.com',
      state: 'active',
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
    {value: 'temporalBlocked', viewValue: 'Temporally blocked'},
    {value: 'permBlocked', viewValue: 'Permanently Blocked'},
    {value: 'verPending', viewValue: 'Verification Pending'},
  ];
  subscriptions: { value: string, viewValue: string }[] = [
    {value: 'free', viewValue: 'Free'},
    {value: 'premium', viewValue: 'Premium'},
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
