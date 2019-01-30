import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as ProfilesActions from './../store/profiles.actions';
import * as fromProfiles from './../store/profiles.reducers';
import {UtilsService} from '../../utils.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {

  profilesState: Observable<fromProfiles.State>;

  constructor(private _utils: UtilsService, private store$: Store<fromApp.AppState>, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    // console.log(params.id);
    this.store$.dispatch(new ProfilesActions.TryGetProfileCandidate({id: params.id}));
    this.profilesState = this.store$.pipe(select(state => state.profiles));
    // this.store$.dispatch(new ProfilesActions.TryGetProfileOfferer({id: params.id}));
    // this.profilesState = this.store$.pipe(select(state => state.profiles));
  }

}
