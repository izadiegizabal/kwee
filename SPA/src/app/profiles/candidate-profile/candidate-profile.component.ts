import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as ProfilesActions from '../store/profiles.actions';
import * as fromProfiles from '../store/profiles.reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {Title} from '@angular/platform-browser';
import {Location} from '@angular/common';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit {
  imgPath = '../../../../assets/img/defaultProfileImg.png';

  candidate = {
    name: 'Shiba Inu Kawaii',
    kweeIndex: 99,
    bio: 'The Shiba Inu (柴犬) is the smallest of the six original and distinct spitz breeds of dog native to Japan.\n' +
      '\n' +
      'A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was originally bred for hunting. It looks similar ' +
      'to and is often mistaken for other Japanese dog breeds like the Akita Inu or Hokkaido, but the Shiba Inu is a different breed with' +
      ' a distinct blood line, temperament and smaller size than other Japanese dog breeds.',
    img: 'https://steemitimages.com/DQmcitBuKSUc9hhetXkhSz3Boca9Y2cgVWEaqsMcC6d4Zzb/ryuji-640x640.jpg',
    experience: [
      {
        title: 'Android Developer',
        company: 'Google',
        start: '2016-02-16',
        end: '2019-01-29',
        description: 'Android software development is the process by which new applications are created for devices running the Android' +
          ' operating system. Google states that[3] "Android apps can be written using Kotlin, Java, and C++ languages" using the ' +
          'Android software development kit (SDK), while using other languages is also possible. All non-JVM languages, such as Go, ' +
          'JavaScript, C, C++ or assembly, need the help of JVM language code, that may be supplied by tools, likely with restricted ' +
          'API support. Some languages/programming tools allow cross-platform app support, i.e. for both Android and iOS. Third party' +
          ' tools, development environments and language support have also continued to evolve and expand since the initial SDK was ' +
          'released in 2008. In addition, with major business entities like Walmart, Amazon, Bank of America etc. eyeing to engage and' +
          ' sell through mobiles, mobile application development is witnessing a transformation.'
      },
      {
        title: 'Web Designer',
        company: 'Mercadona',
        start: '2013-02-16',
        end: '2016-01-29',
        description: 'Android software development is the process by which new applications are created for devices running the Android' +
          ' operating system. Google states that[3] "Android apps can be written using Kotlin, Java, and C++ languages" using the ' +
          'Android software development kit (SDK), while using other languages is also possible. All non-JVM languages, such as Go, ' +
          'JavaScript, C, C++ or assembly, need the help of JVM language code, that may be supplied by tools, likely with restricted ' +
          'API support. Some languages/programming tools allow cross-platform app support, i.e. for both Android and iOS. Third party' +
          ' tools, development environments and language support have also continued to evolve and expand since the initial SDK was ' +
          'released in 2008. In addition, with major business entities like Walmart, Amazon, Bank of America etc. eyeing to engage and' +
          ' sell through mobiles, mobile application development is witnessing a transformation.'
      },
    ],
    education: [
      {
        title: 'Multimedia Engineering',
        institution: 'University of Alicante',
        start: '2015-09-05',
        end: '2019-09-15',
        description: 'Located midway between traditional engineering and information technology engineering, the general aim of the ' +
          'Degree in Multimedia Engineering is to produce professionals in the ICT Sector who are capable of leading new projects in' +
          ' the world of Multimedia.\n' +
          '\n' +
          'The course provides quality training based on “Project-led learning” aimed at providing students with the skills necessary' +
          ' to create digital systems for the management of multimedia information, to provide technical support to multimedia projects' +
          ' and to produce and provide support to the technical elements involved in the creation of images and sound related to ' +
          '“digital leisure”.'
      }
    ],
    languages: [
      {
        name: 'Basque',
        level: 'Native'
      },
      {
        name: 'Spanish',
        level: 'Native'
      },
      {
        name: 'English',
        level: 'Full Business Proficiency'
      },
      {
        name: 'Japanese',
        level: 'Elementary Proficiency'
      },
    ],
    skills: ['Java', 'Android', 'Kotlin', 'HTML', 'CSS', 'JS', 'Angular', 'Android Studio', 'MySQL',
    ],
    twitter: 'Applicant',
    telegram: 'Applicant',
    github: 'Applicant',
    linkedin: 'Applicant'
  };

  profilesState: Observable<fromProfiles.State>;
  // To check if this is my profile
  mine = false;

  constructor(
    private titleService: Title,
    private store$: Store<fromApp.AppState>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location) {
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store$.dispatch(new ProfilesActions.TryGetProfileCandidate({id: params.id}));
    this.profilesState = this.store$.pipe(select(state => state.profiles));
    this.store$.pipe(select(state => state.auth)).subscribe(
      s => {
        if (s.user) {
          this.mine = Number(params.id) === s.user.id;
        }
      }
    );
    this.profilesState.subscribe(s => {
      if (s.candidate) {
        this.titleService.setTitle('Kwee - ' + s.candidate.name);
      }
    });
  }

  goToMyOffers(tabIndex: number) {
    if (tabIndex && tabIndex === 2) {
      this.router.navigate(['/my-offers']);
    }
  }

  getProfileImg() {
    this.profilesState.subscribe(s => {
      if (s.candidate && s.candidate.img) {
        this.imgPath = environment.apiUrl + 'image/applicants/' + s.candidate.img;
      } else {
        this.imgPath = '../../../../assets/img/defaultProfileImg.png';
      }
    });

    return this.imgPath;
  }

  backClicked() {
    this.location.back();
  }
}
