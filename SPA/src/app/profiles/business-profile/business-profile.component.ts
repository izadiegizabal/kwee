import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
    twitter: 'Facebook',
    linkedin: 'Facebook',
    telegram: 'Facebook',
    github: 'Facebook'
  };

  profilesState: Observable<fromProfiles.State>;
  mine = false;
  busi: any;

  constructor(
    private titleService: Title,
    private store$: Store<fromApp.AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store$.dispatch(new ProfilesActions.TryGetProfileBusiness({id: params.id}));
    this.profilesState = this.store$.pipe(select(state => state.profiles));
    this.store$.pipe(select(state => state.auth)).subscribe(
      s => {
        if (s.user) {
          this.mine = Number(params.id) === s.user.id;
        }
      }
    );

    this.profilesState.subscribe(s => {
      if (s.business) {
        this.busi = s.business;
        this.titleService.setTitle('Kwee - ' + s.business.name);
      }
    });
  }

  goToMyOffers(tabIndex: number) {
    if (tabIndex && tabIndex === 2) {
      this.router.navigate(['/my-offers']);
    }
  }

  backClicked() {
    this.location.back();
  }

  getImg(img: string) {
    if (img) {
      return environment.apiUrl + 'image/offerers/' + img;
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
