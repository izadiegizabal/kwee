import {Component, OnInit} from '@angular/core';
import {getTimePassed} from '../../../shared/utils.service';

@Component({
  selector: 'app-business-profile-opinions',
  templateUrl: './business-profile-opinions.component.html',
  styleUrls: [
    './business-profile-opinions.component.scss',
    '../../candidate-profile/candidate-profile-opinions/candidate-profile-opinions.component.scss',
  ]
})
export class BusinessProfileOpinionsComponent implements OnInit {

  opinions = [
    {
      opinionId: 5,
      publishedAt: '2019-01-03',
      offerId: 2,
      offerTitle: 'Senior SEO Expert',
      userId: 5,
      userName: 'Flaviu Lucian Georgiu',
      userIndex: 88,
      opinionScore: 3,
      ratingScore: 4.1,
      opinion: 'Very nice working environment, nice salary and fantastic boss, really recommended!',
      details: {
        salary: 5,
        environment: 3,
        partners: 5,
        services: 2,
        installations: 4,
      },
      replies: [
        {
          replyId: 1,
          userId: 3,
          userName: 'Flaviu',
          userIndex: 91,
          reply: 'I completely agree, this business is one of the bests in the field',
        },
      ]
    },
    {
      opinionId: 9,
      publishedAt: '2019-01-03',
      offerId: 3,
      offerTitle: 'Junior Android Developer',
      userId: 5,
      userName: 'Izadi Egizabal Alkorta',
      userIndex: 96,
      opinionScore: 3,
      ratingScore: 3.1,
      opinion: 'Very nice working environment, nice salary and fantastic boss, really recommended!',
      details: {
        salary: 5,
        environment: 3,
        partners: 5,
        services: 2,
        installations: 4,
      },
      replies: [
        {
          replyId: 1,
          userId: 3,
          userName: 'Flaviu',
          userIndex: 91,
          reply: 'I completely agree, this business is one of the bests in the field',
        },
      ]
    },
  ];

  constructor() {
  }

  ngOnInit() {
  }

  getPublishedDate(date: string) {
    return getTimePassed(new Date(date));
  }
}
