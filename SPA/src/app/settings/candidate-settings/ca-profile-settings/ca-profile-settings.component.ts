import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as ProfilesActions from '../../../profiles/store/profiles.actions';
import {Observable} from 'rxjs';
import * as fromAuth from '../../../auth/store/auth.reducers';
import * as fromProfiles from '../../../profiles/store/profiles.reducers';
import {environment} from '../../../../environments/environment';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import * as fromApp from '../../../store/app.reducers';
import {AuthEffects} from '../../../auth/store/auth.effects';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DialogImageCropComponent} from '../../../auth/signup/dialog-image-crop/dialog-image-crop.component';
import {DialogErrorComponent} from '../../../auth/signup/dialog-error/dialog-error.component';
import {LanguageLevels} from '../../../../models/Candidate.model';
import {isStringNotANumber} from '../../../../models/Offer.model';
import {OkDialogComponent} from '../../../shared/ok-dialog/ok-dialog.component';

import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'app-ca-profile-settings',
  templateUrl: './ca-profile-settings.component.html',
  styleUrls: [
    './ca-profile-settings.component.scss',
    '../ca-account-settings/ca-account-settings.component.scss'
  ]
})
export class CaProfileSettingsComponent implements OnInit {

  // State variables
  token;
  authState: Observable<fromAuth.State>;
  profilesState: Observable<fromProfiles.State>;
  apiURL = environment.apiUrl;

  // Control variables
  private dialogShown = false;
  iskill = 0;
  iskillang = 0;

  // Form
  thirdFormGroup: FormGroup;
  fileEvent = null;
  file: any;
  proficiencies = Object
    .keys(LanguageLevels)
    .filter(isStringNotANumber)
    .map(key => ({value: LanguageLevels[key], viewValue: key}));

  constructor(private _formBuilder: FormBuilder,
              public dialog: MatDialog,
              private router: Router,
              private store$: Store<fromApp.AppState>, private authEffects$: AuthEffects,
              private httpClient: HttpClient) {
    this.iskill = 0;
    this.iskillang = 0;
  }

  ngOnInit() {
    // Get profile
    this.authState = this.store$.pipe(select(state => state.auth));
    this.authState.subscribe((state) => {
      if (state && state.user && state.user.id > 0 && !this.token) {
        this.token = state.token;

        // If it's not a candidate redirect to home
        if (state.user.type !== 'candidate') {
          this.router.navigate(['/']);
        }

        this.store$.dispatch(new ProfilesActions.TryGetProfileCandidate({id: state.user.id}));
      }
    });

    // Initialise form
    this.thirdFormGroup = this._formBuilder.group({
      'profile': new FormControl(null),
      'bio': new FormControl(null),
      'twitter': new FormControl(null),
      'linkedIn': new FormControl(null),
      'github': new FormControl(null),
      'telegram': new FormControl(null),
      'skills': new FormArray([new FormControl(null)]),
      'languages': this._formBuilder.array([]),
      'experience': this._formBuilder.array([]),
      'education': this._formBuilder.array([])
    });

    // Prepopulate form
    this.profilesState = this.store$.pipe(select(state => state.profiles));
    this.profilesState.subscribe((state) => {
        if (state.candidate) {
          // console.log(state.candidate);

          this.thirdFormGroup.controls['bio'].setValue(state.candidate.bio);
          // this.thirdFormGroup.controls['companySize'].setValue(state.business.companySize);
          // this.thirdFormGroup.controls['year'].setValue(state.business.year);
          // this.thirdFormGroup.controls['website'].setValue(state.business.website);

          this.prefillSNS(state.candidate);
          this.prefillLanguages(state.candidate.languages);

          // console.log(this.thirdFormGroup.value);
        }
      }
    );

    this.thirdFormGroup.controls['twitter'].valueChanges.subscribe(() => {
      const value = <String>this.thirdFormGroup.controls['twitter'].value;
      if (value.includes('twitter.com/')) {
        const arr = value.split('twitter.com/');
        this.thirdFormGroup.controls['twitter'].setValue(arr[arr.length - 1]);
      }
    });

    this.thirdFormGroup.controls['linkedIn'].valueChanges.subscribe(() => {
      let value = this.thirdFormGroup.controls['linkedIn'].value;
      if (value.includes('linkedin.com/in/')) {
        let arr = value.split('linkedin.com/in/');
        value = arr[arr.length - 1];
        arr = value.split('/');
        value = arr[0];
        this.thirdFormGroup.controls['linkedIn'].setValue(value);
      }
    });

    this.thirdFormGroup.controls['github'].valueChanges.subscribe(() => {
      const value = <String>this.thirdFormGroup.controls['github'].value;
      if (value.includes('github.com/')) {
        const arr = value.split('github.com/');
        this.thirdFormGroup.controls['github'].setValue(arr[arr.length - 1]);
      }
    });

    this.thirdFormGroup.controls['telegram'].valueChanges.subscribe(() => {
      const value = <String>this.thirdFormGroup.controls['telegram'].value;
      if (value.includes('telegram.me/')) {
        const arr = value.split('telegram.me/');
        this.thirdFormGroup.controls['telegram'].setValue(arr[arr.length - 1]);
      }
      if (value.includes('t.me/')) {
        const arr = value.split('t.me/');
        this.thirdFormGroup.controls['telegram'].setValue(arr[arr.length - 1]);
      }
    });
  }

  onSaveOptional() {
    // console.log(this.thirdFormGroup);

    const update = {
      'bio': this.thirdFormGroup.controls['bio'].value,
      'social_networks': {
        'twitter': this.thirdFormGroup.controls['twitter'].value,
        'linkedin': this.thirdFormGroup.controls['linkedIn'].value,
        'github': this.thirdFormGroup.controls['github'].value,
        'telegram': this.thirdFormGroup.controls['telegram'].value,
      },
      'languages': this.thirdFormGroup.controls['languages'].value,
      'experiences': this.getFormattedExperiences(),
      'educations': this.getFormattedEducations(),
      'skills': this.getFormattedSkills()
    };
    if (this.file) {
      update['img'] = this.file;
    }

    console.log(update);

    this.submitUpdate(update);
  }

  //////////////////////////////////////////////////////////////////////////////
  // Helper methods ////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Prefill form with stored data
  private prefillSNS(candidate: any) {
    if (candidate.social_networks.twitter) {
      this.thirdFormGroup.controls['twitter'].setValue(candidate.social_networks.twitter);
    } else {
      this.thirdFormGroup.controls['twitter'].setValue('');
    }

    if (candidate.social_networks.linkedin) {
      this.thirdFormGroup.controls['linkedIn'].setValue(candidate.social_networks.linkedin);
    } else {
      this.thirdFormGroup.controls['linkedIn'].setValue('');
    }

    if (candidate.social_networks.github) {
      this.thirdFormGroup.controls['github'].setValue(candidate.social_networks.github);
    } else {
      this.thirdFormGroup.controls['github'].setValue('');
    }

    if (candidate.social_networks.telegram) {
      this.thirdFormGroup.controls['telegram'].setValue(candidate.social_networks.telegram);
    } else {
      this.thirdFormGroup.controls['telegram'].setValue('');
    }
  }

  private prefillLanguages(languages: { language: string, applicant_languages: { level: string } }[]) {
    if ((<FormArray>this.thirdFormGroup.controls['languages'].value).length === 0) {
      for (const language of languages) {
        (<FormArray>this.thirdFormGroup.controls['languages']).push(
          this._formBuilder.group({
            'language': new FormControl(language.language, Validators.required),
            'level': new FormControl(language.applicant_languages.level, Validators.required)
          }));
        this.iskillang++;
      }
      console.log(this.thirdFormGroup.controls['languages'].value);
    }
  }

  // Submit modified candidate
  submitUpdate(update: any) {
    const options = {
      headers: new HttpHeaders().append('token', this.token)
        .append('Content-Type', 'application/json')
    };
    this.httpClient.post(environment.apiUrl + 'applicant/info', update, options)
      .subscribe((data: any) => {
        if (!this.dialogShown) {
          this.dialog.open(OkDialogComponent, {
            data: {
              message: 'Account info updated correctly!',
            }
          });
          this.dialogShown = true;
        }
      }, (error: any) => {
        console.log(error);
        if (!this.dialogShown) {
          this.dialog.open(DialogErrorComponent, {
            data: {
              header: 'We had some issues updating your settings',
              error: 'Please try again later',
            }
          });
          this.dialogShown = true;
        }
      });
  }

  // Format data for the API
  getFormattedSkills(): any[] {
    const skills = [];
    for (const skill of this.thirdFormGroup.controls['skills'].value) {

      if (skill) {
        const newSkill = {
          name: skill as string,
          description: '',
          level: '',
        };

        skills.push(newSkill);
      }
    }
    return skills;
  }

  getFormattedExperiences(): any[] {
    const experiences = [];
    for (const experience of this.thirdFormGroup.controls['experience'].value) {

      // Go from Moment object to the desired data format
      if (experience.end) {
        experience.end = moment(experience.end).format('YYYY-MM-DD');
      } else {
        experience.end = moment().format('YYYY-MM-DD');
      }
      experience.start = moment(experience.start).format('YYYY-MM-DD');

      // Rename the keys
      Object.defineProperty(experience, 'dateEnd', Object.getOwnPropertyDescriptor(experience, 'end'));
      delete experience['end'];
      Object.defineProperty(experience, 'dateStart', Object.getOwnPropertyDescriptor(experience, 'start'));
      delete experience['start'];

      experiences.push(experience);
    }
    return experiences;
  }

  getFormattedEducations(): any[] {
    const educations = [];
    for (const education of this.thirdFormGroup.controls['education'].value) {
      // Go from Moment object to the desired data format
      if (education.end) {
        education.end = moment(education.end).format('YYYY-MM-DD');
      } else {
        education.end = moment().format('YYYY-MM-DD');
      }
      education.start = moment(education.start).format('YYYY-MM-DD');

      // Rename the keys
      Object.defineProperty(education, 'dateEnd', Object.getOwnPropertyDescriptor(education, 'end'));
      delete education['end'];
      Object.defineProperty(education, 'dateStart', Object.getOwnPropertyDescriptor(education, 'start'));
      delete education['start'];

      educations.push(education);
    }
    return educations;
  }

  ///////////////////////////////
  // Form
  formInitialized(name: string, form: FormGroup) {
    this.thirdFormGroup.setControl(name, form);
  }


  /// Skills ////
  get formSkills() {
    return <FormArray>this.thirdFormGroup.get('skills');
  }

  add_skill() {
    (<FormArray>this.thirdFormGroup.controls['skills']).push(new FormControl(null));
    this.iskill++;
    // console.log(this.formSkills.length);
    setTimeout(() => {
      document.getElementById(`skill${this.iskill}`).focus();
    }, 1);
  }

  deleteSkill(i) {
    (<FormArray>this.thirdFormGroup.controls['skills']).removeAt(i);
    this.iskill--;
  }

  /// Languages ///
  get formLanguages() {
    return <FormArray>this.thirdFormGroup.get('languages');
  }

  addLanguage() {
    (<FormArray>this.thirdFormGroup.controls['languages']).push(this.addLanguageGroup());
    this.iskillang++;
    // console.log(this.formLanguages);
  }

  addLanguageGroup(): FormGroup {
    return this._formBuilder.group({
      'language': new FormControl(null, Validators.required),
      'level': new FormControl(null, Validators.required)
    });
  }

  deleteLanguage(i) {
    (<FormArray>this.thirdFormGroup.controls['languages']).removeAt(i);
    this.iskillang--;
  }

  getProf(n: string) {
    for (const proficiency of this.proficiencies) {
      if (proficiency.value === n) {
        return proficiency.viewValue;
      }
    }
  }

  onDoneLang(index: number) {
    if (!(<FormArray>this.thirdFormGroup.controls['languages']).controls[index].valid) {
      (<FormGroup>(<FormArray>this.thirdFormGroup.get('languages')).controls[index]).controls.language.markAsTouched();
      (<FormGroup>(<FormArray>this.thirdFormGroup.get('languages')).controls[index]).controls.proficiency.markAsTouched();
    } else {
      return true;
    }
    return false;
  }

  ////////////////////////
  // Image Cropper
  previewFile(event: any) {

    this.fileEvent = event;
    /// 3MB IMAGES MAX
    if (event.target.files[0]) {
      if (event.target.files[0].size < 3000000) {
        // @ts-ignore
        const preview = (document.getElementById('photo_profile') as HTMLInputElement);
        const file = (document.getElementById('file_profile') as HTMLInputElement).files[0];
        const reader = new FileReader();
        reader.onloadend = function () {
          // @ts-ignore
          preview.src = reader.result;
        };
        reader.readAsDataURL(file);

        const dialogRef = this.dialog.open(DialogImageCropComponent, {
          width: '90%',
          height: '90%',
          data: event
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // console.log(result);
            preview.src = result;
            this.file = result;
          }
        });
      } else {
        this.deletePhoto();
        this.dialog.open(DialogErrorComponent, {
          data: {
            header: 'The Upload process has failed. Please try again later or use another image.',
            error: 'Error: Your image is too big. We only allow files under 3Mb.',
          }
        });
        this.dialogShown = true;
      }
    } else {
      this.deletePhoto();
    }
  }

  deletePhoto() {
    (document.getElementById('photo_profile') as HTMLInputElement).src = '../../../../assets/img/defaultProfileImg.png';
    this.thirdFormGroup.controls['profile'].setValue(null);
  }
}
