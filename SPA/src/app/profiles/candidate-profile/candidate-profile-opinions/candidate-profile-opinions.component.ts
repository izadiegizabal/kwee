import {Component, OnInit} from '@angular/core';
import {getTimePassed} from '../../../shared/utils.service';

@Component({
  selector: 'app-candidate-profile-opinions',
  templateUrl: './candidate-profile-opinions.component.html',
  styleUrls: ['./candidate-profile-opinions.component.scss']
})
export class CandidateProfileOpinionsComponent implements OnInit {

  opinions = [
    {
      opinionId: 5,
      publishedAt: '2019-01-03',
      offerId: 2,
      offerTitle: 'Senior SEO Expert',
      userId: 5,
      userName: 'Google SA.',
      userIndex: 88,
      opinionScore: 3,
      ratingScore: 4.1,
      opinion: 'He\'s a really nice worker and it\'s always a pleasure to work with him. He arrives punctually and he\'s very professional',
      details: {
        efficiency: 5,
        skills: 3,
        punctuality: 5,
        hygiene: 2,
        teamwork: 4,
      },
      replies: [
        {
          replyId: 1,
          userId: 3,
          userName: 'Flaviu',
          userIndex: 91,
          reply: 'I completely agree, he\'s one of the bests in the field',
        },
      ]
    },
    {
      opinionId: 5,
      publishedAt: '2016-01-03',
      offerId: 2,
      offerTitle: 'Advanced Android Developer',
      userId: 5,
      userName: 'Amazon',
      userIndex: 88,
      opinionScore: 5,
      ratingScore: 3.2,
      opinion: 'He\'s a really nice worker and it\'s always a pleasure to work with him. He arrives punctually and he\'s very professional',
      details: {
        efficiency: 5,
        skills: 3,
        punctuality: 5,
        hygiene: 2,
        teamwork: 4,
      },
      replies: [
        {
          replyId: 1,
          userId: 3,
          userName: 'Flaviu',
          userIndex: 91,
          reply: 'I completely agree, he\'s one of the bests in the field',
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
