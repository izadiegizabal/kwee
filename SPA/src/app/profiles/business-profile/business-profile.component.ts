import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {Observable} from 'rxjs';
import * as fromProfiles from '../store/profiles.reducers';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as ProfilesActions from '../store/profiles.actions';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: [
    '../candidate-profile/candidate-profile.component.scss',
    './business-profile.component.scss',
  ]
})
export class BusinessProfileComponent implements OnInit, AfterViewInit {
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
    twitter: 'Facebook',
    linkedin: 'Facebook',
    telegram: 'Facebook',
    github: 'Facebook'
  };

  profilesState: Observable<fromProfiles.State>;
  mine = false;
  busi: any;

  // TODO: load this dynamically
  twitterAccount = '';
  selectedIndex: number;
  private params: Params;

  constructor(
    private titleService: Title,
    private store$: Store<fromApp.AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
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
        case 'jobs':
          this.changeTab(2);
          break;
      }
    }
  }

  ngOnInit() {
    this.params = this.activatedRoute.snapshot.params;
    this.goToCorrectTab();

    this.activatedRoute.params.subscribe(() => {
      this.params = this.activatedRoute.snapshot.params;
      this.goToCorrectTab();
    });

    this.store$.dispatch(new ProfilesActions.TryGetProfileBusiness({id: this.params.id}));
    this.profilesState = this.store$.pipe(select(state => state.profiles));
    this.store$.pipe(select(state => state.auth)).subscribe(
      s => {
        if (s.user) {
          this.mine = Number(this.params.id) === s.user.id;
        }
      }
    );

    this.profilesState.subscribe(s => {
      if (s.business) {
        this.busi = s.business;
        if (this.busi && this.busi.social_networks && this.busi.social_networks.twitter) {
          this.twitterAccount = this.busi.social_networks.twitter;
        }
        this.titleService.setTitle('Kwee - ' + s.business.name);
      }
    });
  }

  ngAfterViewInit() {
    // @ts-ignore
    twttr.widgets.load();
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
          if (this.mine) {
            this.router.navigate(['/my-offers']);
          } else {
            this.router.navigate(['jobs'], {relativeTo: this.activatedRoute.parent});
          }
          break;
      }
    }
  }

  backClicked() {
    this.location.back();
  }

  getImg(img: string) {
    if (img) {
      return environment.apiUrl + img;
    } else {
      return this.business.img;
    }
  }

  contactUser() {
    if (this.busi.email) {
      const href = 'mailto:' + this.busi.email + '?subject=Enquiry about your Kwee Profile';
      location.href = href;
    }
  }
}
