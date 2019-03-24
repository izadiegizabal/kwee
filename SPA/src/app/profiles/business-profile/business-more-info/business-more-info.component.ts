import {Component, Input, OnInit} from '@angular/core';
import {BusinessIndustries} from '../../../../models/Business.model';

@Component({
  selector: 'app-business-more-info',
  templateUrl: './business-more-info.component.html',
  styleUrls: ['./business-more-info.component.scss']
})
export class BusinessMoreInfoComponent implements OnInit {

  @Input() business: any;

  mockBusiness = {
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
    twitter: 'Facebook',
    linkedin: 'Facebook',
    telegram: 'Facebook',
    github: 'Facebook'
  };
  infoNAMess = 'Information not available.';

  constructor() {
  }

  ngOnInit() {
  }

  getSize() {
    let size = 'Information not available.';
    switch (Number(this.business.companySize)) {
      case 10:
        size = 'Less than 10 people.';
        break;
      case 50:
        size = 'Between 11 and 50 people.';
        break;
      case 100:
        size = 'Between 51 and 100 people.';
        break;
      case 1000:
        size = 'More than 1.000 people.';
        break;
    }

    return size.substring(0, size.length - 1);
  }

  getIndustry() {
    return BusinessIndustries[this.business.workField];
  }
}
