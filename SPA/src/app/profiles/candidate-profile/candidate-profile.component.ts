import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as ProfilesActions from '../store/profiles.actions';
import * as fromProfiles from '../store/profiles.reducers';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {Title} from '@angular/platform-browser';
import {Location} from '@angular/common';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit, AfterViewInit {
  imgPath = '../../../../assets/img/defaultProfileImg.png';
  premium = 0;

  candidate = {
    name: 'Shiba Inu Kawaii',
    kweeIndex: 99,
  };

  profilesState: Observable<fromProfiles.State>;
  // To check if this is my profile
  mine = false;
  twitterAccount = '';
  private cand: any;
  private selectedIndex: number;
  private params: Params;

  constructor(
    private titleService: Title,
    private store$: Store<fromApp.AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location) {
  }

  ngOnInit() {
    this.params = this.activatedRoute.snapshot.params;
    this.goToCorrectTab();

    this.activatedRoute.params.subscribe(() => {
      this.params = this.activatedRoute.snapshot.params;
      this.goToCorrectTab();
    });

    this.store$.dispatch(new ProfilesActions.TryGetProfileCandidate({id: this.params.id}));
    this.profilesState = this.store$.pipe(select(state => state.profiles));
    this.store$.pipe(select(state => state.auth)).subscribe(
      s => {
        if (s.user) {
          if (s.user.premium) {
            this.premium = s.user.premium;
          }
          this.mine = Number(this.params.id) === s.user.id;
        }
      }
    );
    this.profilesState.subscribe(s => {
      if (s.candidate) {
        this.cand = s.candidate;
        if (this.cand && this.cand.social_networks && this.cand.social_networks.twitter) {
          this.twitterAccount = this.cand.social_networks.twitter;
        }
        this.titleService.setTitle('Kwee - ' + this.cand.name);
      }
    });
  }

  ngAfterViewInit() {
    // @ts-ignore
    if (twttr) {
      // @ts-ignore
      twttr.widgets.load();
    }
  }

  goToCorrectTab() {
    if (this.params['tabPosition']) {
      switch (this.params['tabPosition']) {
        case 'more-info':
          this.changeTab(0);
          break;
        case 'opinions':
          this.changeTab(1);
          break;
        case 'past-positions':
          this.changeTab(2);
          break;
      }
    }
  }

  changeTab(tabIndex: number) {
    this.selectedIndex = tabIndex;

    if (this.params) {
      switch (tabIndex) {
        case 0:
          this.router.navigate(['more-info'], {relativeTo: this.activatedRoute.parent});
          break;
        case 1:
          this.router.navigate(['opinions'], {relativeTo: this.activatedRoute.parent});
          break;
        case 2:
          this.router.navigate(['past-positions'], {relativeTo: this.activatedRoute.parent});

          // if (this.mine) {
          //   this.router.navigate(['/my-offers']);
          // } else {
          //   this.router.navigate(['past-positions'], {relativeTo: this.activatedRoute.parent});
          // }
          break;
      }
    }
  }

  getProfileImg() {
    if (this.cand && this.cand.img) {
      this.imgPath = environment.apiUrl + this.cand.img;
    } else {
      this.imgPath = '../../../../assets/img/defaultProfileImg.png';
    }

    return this.imgPath;
  }

  backClicked() {
    this.location.back();
  }

  contactUser() {
    if (this.cand.email) {
      const href = 'mailto:' + this.cand.email + '?subject=Enquiry about your Kwee Profile';
      location.href = href;
    }
  }
}
