import {Component, OnInit, ViewChild} from '@angular/core';
import {getTimePassed} from '../../../shared/utils';
import * as ProfilesActions from '../../store/profiles.actions';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import * as fromProfiles from '../../store/profiles.reducers';
import {MatPaginator, PageEvent} from '@angular/material';
import {filter} from 'rxjs/operators';
import {ProfilesEffects} from '../../store/profiles.effects';

@Component({
  selector: 'app-candidate-profile-opinions',
  templateUrl: './candidate-profile-opinions.component.html',
  styleUrls: ['./candidate-profile-opinions.component.scss']
})
export class CandidateProfileOpinionsComponent implements OnInit {

  opinionsNA =
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
    };
  // {
  //   opinionId: 5,
  //   publishedAt: '2016-01-03',
  //   offerId: 2,
  //   offerTitle: 'Advanced Android Developer',
  //   userId: 5,
  //   userName: 'Amazon',
  //   userIndex: 88,
  //   opinionScore: 5,
  //   ratingScore: 3.2,
  //    opinion: 'He\'s a really nice worker and it\'s always a' +
  //    ' pleasure to work with him. He arrives punctually and he\'s very professional',
  //   details: {
  //     efficiency: 5,
  //     skills: 3,
  //     punctuality: 5,
  //     hygiene: 2,
  //     teamwork: 4,
  //   },
  //   replies: [
  //     {
  //       replyId: 1,
  //       userId: 3,
  //       userName: 'Flaviu',
  //       userIndex: 91,
  //       reply: 'I completely agree, he\'s one of the bests in the field',
  //     },
  //   ]
  // },
  // ];

  profilesState: Observable<fromProfiles.State>;

  // MatPaginator
  pageSize = 5;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];
  pageEvent: PageEvent;

  errorOpinion = false;

  @ViewChild('paginator') paginator: MatPaginator;


  constructor(private store$: Store<fromApp.AppState>,
              private activatedRoute: ActivatedRoute, private profilesEffects$: ProfilesEffects) {
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store$.dispatch(new ProfilesActions.TryGetOpinionsUser({id: params.id, limit: 5, page: 1}));
    this.profilesState = this.store$.pipe(select(state => state.profiles));

    this.profilesEffects$.profileGetOpinions.pipe(
      filter((action: Action) => action.type === ProfilesActions.OPERATION_ERROR)
    ).subscribe((error: { payload: any, type: string }) => {
      // console.log(error.payload);
      this.errorOpinion = true;
    });
  }

  getPublishedDate(date: string) {
    return getTimePassed(new Date(date));
  }

  changePage() {
    const params = this.activatedRoute.snapshot.params;
    this.store$.dispatch(new ProfilesActions.TryGetOpinionsUser({
      id: params.id, page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize
    }));

    window.scrollTo(0, 0);
  }
}
