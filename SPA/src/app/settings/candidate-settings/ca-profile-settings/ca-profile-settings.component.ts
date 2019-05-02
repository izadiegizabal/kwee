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
      if (state && state.user && state.user.id > 0) {
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

          if (state.candidate.social_networks.twitter) {
            this.thirdFormGroup.controls['twitter'].setValue(state.candidate.social_networks.twitter);
          } else {
            this.thirdFormGroup.controls['twitter'].setValue('');
          }

          if (state.candidate.social_networks.linkedin) {
            this.thirdFormGroup.controls['linkedIn'].setValue(state.candidate.social_networks.linkedin);
          } else {
            this.thirdFormGroup.controls['linkedIn'].setValue('');
          }

          if (state.candidate.social_networks.github) {
            this.thirdFormGroup.controls['github'].setValue(state.candidate.social_networks.github);
          } else {
            this.thirdFormGroup.controls['github'].setValue('');
          }

          if (state.candidate.social_networks.telegram) {
            this.thirdFormGroup.controls['telegram'].setValue(state.candidate.social_networks.telegram);
          } else {
            this.thirdFormGroup.controls['telegram'].setValue('');
          }
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
    console.log(this.thirdFormGroup);
    const auxSkills = (this.thirdFormGroup.controls['skills'].value as Array<string>).filter(e => {
      return (e !== null);
    }).join(',');

    const update = {
      'img': this.file,
      'bio': this.thirdFormGroup.controls['bio'].value,
      'social_networks': {
        'twitter': this.thirdFormGroup.controls['twitter'].value,
        'linkedin': this.thirdFormGroup.controls['linkedIn'].value,
        'github': this.thirdFormGroup.controls['github'].value,
        'telegram': this.thirdFormGroup.controls['telegram'].value,
      },
      'skills': auxSkills
      // 'languages': this._formBuilder.array([]),
      // 'experience': this._formBuilder.array([]),
      // 'education': this._formBuilder.array([])
    };

    // Submit the update
    // PUT modified candidate
    const options = {
      headers: new HttpHeaders().append('token', this.token)
        .append('Content-Type', 'application/json')
    };
    this.httpClient.put(environment.apiUrl + 'applicant', update, options)
      .subscribe((data: any) => {
        // console.log(data);
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

  //////////////////////////////////////////////////////////////////////////////
  // Helper methods ////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

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

  getProf(n: number) {
    return this.proficiencies[n].viewValue;
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
