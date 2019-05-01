import {Component, OnInit} from '@angular/core';
import {BusinessSize} from '../../../../models/Business.model';
import {isStringNotANumber} from '../../../../models/Offer.model';
import {Observable} from 'rxjs';
import * as fromAuth from '../../../auth/store/auth.reducers';
import * as fromProfiles from '../../../profiles/store/profiles.reducers';
import {environment} from '../../../../environments/environment';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as ProfilesActions from '../../../profiles/store/profiles.actions';
import {MatDialog} from '@angular/material';
import * as fromApp from '../../../store/app.reducers';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SignupOffererComponent} from '../../../auth/signup/signup-offerer/signup-offerer.component';
import {DialogErrorComponent} from '../../../auth/signup/dialog-error/dialog-error.component';
import {OkDialogComponent} from '../../../shared/ok-dialog/ok-dialog.component';

@Component({
  selector: 'app-bs-profile-settings',
  templateUrl: './bs-profile-settings.component.html',
  styleUrls: [
    './bs-profile-settings.component.scss',
    '../bs-account-settings/bs-account-settings.component.scss'
  ]
})
export class BsProfileSettingsComponent implements OnInit {

  companySizes = Object
    .keys(BusinessSize)
    .filter(isStringNotANumber)
    .map(key => ({value: BusinessSize[key], viewValue: key}));

  // State variables
  token;
  authState: Observable<fromAuth.State>;
  profilesState: Observable<fromProfiles.State>;

  // Settings forms
  profileFormGroup: FormGroup;

  // Control variables
  dialogShown = false;


  constructor(private _formBuilder: FormBuilder,
              public dialog: MatDialog,
              private store$: Store<fromApp.AppState>,
              private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.authState = this.store$.pipe(select(state => state.auth));
    this.authState.subscribe((state) => {
      if (state && state.user && state.user.id > 0) {
        this.token = state.token;
        this.store$.dispatch(new ProfilesActions.TryGetProfileBusiness({id: state.user.id}));
      }
    });

    // Initialise form
    this.profileFormGroup = this._formBuilder.group({
      'about': new FormControl(),
      'twitter': new FormControl(null),
      'linkedIn': new FormControl(null),
      'github': new FormControl(null),
      'telegram': new FormControl(null),
      'website': new FormControl(),
      'companySize': new FormControl(),
      'year': new FormControl(),
    });

    this.profileFormGroup.controls['year'].setValidators([
      SignupOffererComponent.maxDate.bind(this.profileFormGroup),
    ]);

    // Prepopulate form
    this.profilesState = this.store$.pipe(select(state => state.profiles));
    this.profilesState.subscribe((state) => {
        if (state.business) {
          this.profileFormGroup.controls['about'].setValue(state.business.bio);
          this.profileFormGroup.controls['companySize'].setValue(state.business.companySize);
          this.profileFormGroup.controls['year'].setValue(state.business.year);
          this.profileFormGroup.controls['website'].setValue(state.business.website);

          if (state.business.social_networks.twitter) {
            this.profileFormGroup.controls['twitter'].setValue(state.business.social_networks.twitter);
          } else {
            this.profileFormGroup.controls['twitter'].setValue('');
          }

          if (state.business.social_networks.linkedin) {
            this.profileFormGroup.controls['linkedIn'].setValue(state.business.social_networks.linkedin);
          } else {
            this.profileFormGroup.controls['linkedIn'].setValue('');
          }

          if (state.business.social_networks.github) {
            this.profileFormGroup.controls['github'].setValue(state.business.social_networks.github);
          } else {
            this.profileFormGroup.controls['github'].setValue('');
          }

          if (state.business.social_networks.telegram) {
            this.profileFormGroup.controls['telegram'].setValue(state.business.social_networks.telegram);
          } else {
            this.profileFormGroup.controls['telegram'].setValue('');
          }
        }
      }
    );

    this.profileFormGroup.controls['twitter'].valueChanges.subscribe(() => {
      const value = <String>this.profileFormGroup.controls['twitter'].value;
      if (value.includes('twitter.com/')) {
        const arr = value.split('twitter.com/');
        this.profileFormGroup.controls['twitter'].setValue(arr[arr.length - 1]);
      }
    });

    this.profileFormGroup.controls['linkedIn'].valueChanges.subscribe(() => {
      let value = this.profileFormGroup.controls['linkedIn'].value;
      if (value.includes('linkedin.com/in/')) {
        let arr = value.split('linkedin.com/in/');
        value = arr[arr.length - 1];
        arr = value.split('/');
        value = arr[0];
        this.profileFormGroup.controls['linkedIn'].setValue(value);
      }
    });

    this.profileFormGroup.controls['github'].valueChanges.subscribe(() => {
      const value = <String>this.profileFormGroup.controls['github'].value;
      if (value.includes('github.com/')) {
        const arr = value.split('github.com/');
        this.profileFormGroup.controls['github'].setValue(arr[arr.length - 1]);
      }
    });

    this.profileFormGroup.controls['telegram'].valueChanges.subscribe(() => {
      const value = <String>this.profileFormGroup.controls['telegram'].value;
      if (value.includes('telegram.me/')) {
        const arr = value.split('telegram.me/');
        this.profileFormGroup.controls['telegram'].setValue(arr[arr.length - 1]);
      }
      if (value.includes('t.me/')) {
        const arr = value.split('t.me/');
        this.profileFormGroup.controls['telegram'].setValue(arr[arr.length - 1]);
      }
    });
  }

  onUpdate() {

    const update = {
      'bio': this.profileFormGroup.controls['about'].value,
      'social_networks': {
        'twitter': this.profileFormGroup.controls['twitter'].value,
        'linkedin': this.profileFormGroup.controls['linkedIn'].value,
        'github': this.profileFormGroup.controls['github'].value,
        'telegram': this.profileFormGroup.controls['telegram'].value,
      },
      'website': this.profileFormGroup.controls['website'].value,
      'companySize': this.profileFormGroup.controls['companySize'].value,
      'year': this.profileFormGroup.controls['year'].value
    };

    const options = {
      headers: new HttpHeaders().append('token', this.token)
        .append('Content-Type', 'application/json')
    };
    this.httpClient.put(environment.apiUrl + 'offerer', update, options)
      .subscribe((data: any) => {
        // console.log(data);
        this.dialog.open(OkDialogComponent, {
          data: {
            message: 'Profile updated successfully!'
          },
        });
        this.dialogShown = true;
      }, (error: any) => {
        // console.log(error);
        if (!this.dialogShown) {
          this.dialog.open(DialogErrorComponent, {
            data: {
              header: 'We had some issue updating the info',
              error: 'Please try again later',
            }
          });
          this.dialogShown = true;
        }
      });
  }

  getMaxYear() {
    const date = new Date;
    return date.getFullYear();
  }

}
