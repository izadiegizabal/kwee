import {Component, OnInit, ViewChild} from '@angular/core';
import {getTimePassed} from '../../../shared/utils.service';
import {Observable} from 'rxjs';
import * as fromProfiles from '../../store/profiles.reducers';
import {MatPaginator, PageEvent} from '@angular/material';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import {ActivatedRoute} from '@angular/router';
import * as ProfilesActions from '../../store/profiles.actions';

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

  profilesState: Observable<fromProfiles.State>;

  // MatPaginator
  pageSize = 5;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];
  pageEvent: PageEvent;

  @ViewChild('paginator') paginator: MatPaginator;

  constructor(private store$: Store<fromApp.AppState>,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store$.dispatch(new ProfilesActions.TryGetOpinionsUser({id: params.id, limit: 5, page: 1 }));
    this.profilesState = this.store$.pipe(select(state => state.profiles));
  }

  getPublishedDate(date: string) {
    return getTimePassed(new Date(date));
  }

  changePage() {
    const params = this.activatedRoute.snapshot.params;
    this.store$.dispatch(new ProfilesActions.TryGetOpinionsUser({id: params.id,  page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize}));

    window.scrollTo(0, 0);
  }
}
