import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-candidate-overview',
  templateUrl: './candidate-overview.component.html',
  styleUrls: ['./candidate-overview.component.scss']
})
export class CandidateOverviewComponent implements OnInit {

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
      index: 88,
      email: '64izadi.egizabal@gmail.com',
      state: 'active',
      subscription: 'free',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      fullname: 'Izadi Egizabal Alkorta',
      index: 88,
      email: '64izadi@gmail.com',
      state: 'active',
      subscription: 'free',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      fullname: 'Izadi Egizabal Alkorta',
      index: 88,
      email: '64izadi@gmail.com',
      state: 'active',
      subscription: 'free',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      fullname: 'Izadi Egizabal Alkorta',
      index: 88,
      email: '64izadi@gmail.com',
      state: 'active',
      subscription: 'free',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      fullname: 'Izadi Egizabal Alkorta',
      index: 88,
      email: '64izadi@gmail.com',
      state: 'active',
      subscription: 'free',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
    {
      fullname: 'Izadi Egizabal Alkorta',
      index: 88,
      email: '64izadi@gmail.com',
      state: 'active',
      subscription: 'free',
      lastAccess: new Date('2018-11-29T21:24:00'),
      signupDate: new Date('2017-02-01T15:30:00')
    },
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
