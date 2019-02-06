import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: [
    '../candidate-profile/candidate-profile.component.scss',
    './business-profile.component.scss',
  ]
})
export class BusinessProfileComponent implements OnInit {
  business = {
    name: 'Facebook',
    kweeIndex: 56,
    bio: 'Facebook, Inc. is an American online social media and social networking service company. It is based in Menlo Park, ' +
      'California. Its was founded by Mark Zuckerberg, along with fellow Harvard College students and roommates Eduardo Saverin, Andrew' +
      ' McCollum, Dustin Moskovitz and Chris Hughes. It is considered one of the Big Four (actually five) technology companies along with' +
      ' Amazon, Aapple, Google and Microsoft.',
    img: 'https://cdn.worldvectorlogo.com/logos/facebook-1.svg',
    website: 'https://facebook.com',
    size: '1000',
    industry: 'Online Service Company',
    year: '2004-02-04',
    location: {
      lat: -74.20,
      long: 40.51,
    },
    address: '770 Broadway, New York, NY 10003, USA',
  };

  constructor() {
  }

  ngOnInit() {
  }

}
