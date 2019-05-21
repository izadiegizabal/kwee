import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as ProfilesActions from '../../../profiles/store/profiles.actions';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import * as fromApp from '../../../store/app.reducers';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Address, SignupOffererComponent} from '../../../auth/signup/signup-offerer/signup-offerer.component';
import {environment} from '../../../../environments/environment';
import {OkDialogComponent} from '../../../shared/ok-dialog/ok-dialog.component';
import {DialogErrorComponent} from '../../../auth/signup/dialog-error/dialog-error.component';
import {DialogImageCropComponent} from '../../../auth/signup/dialog-image-crop/dialog-image-crop.component';
import {Observable} from 'rxjs';
import * as fromAuth from '../../../auth/store/auth.reducers';
import * as fromProfiles from '../../../profiles/store/profiles.reducers';
import {BusinessIndustries} from '../../../../models/Business.model';
import {isStringNotANumber} from '../../../../models/Offer.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-bs-upload-settings',
  templateUrl: './bs-upload-settings.component.html',
  styleUrls: ['./bs-upload-settings.component.scss']
})
export class BsUploadSettingsComponent implements OnInit {

  token;

  // Settings forms
  accountFormGroup: FormGroup;

  // Control variables
  dialogShown = false;

  profilesState: Observable<fromProfiles.State>;
  fileEvent = null;
  send: any;
  file: any;

  constructor(private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private store$: Store<fromApp.AppState>,
    private httpClient: HttpClient) {
}

  ngOnInit() {
        // Initialise form
        this.accountFormGroup = this._formBuilder.group({
          'file': new FormControl(),
        });

        this.profilesState = this.store$.pipe(select(state => state.profiles));
  }

  deleteFile() {
    this.accountFormGroup.controls['file'].setValue(null);
  }

  previewFile(event: any) {

    this.fileEvent = event;
    /// 3MB IMAGES MAX
    if (event.target.files[0]) {
      if (event.target.files[0].size < 3000000) {
        // @ts-ignore
        const file = (document.getElementById('file_profile') as HTMLInputElement).files[0];
        const reader = new FileReader();
        reader.onloadend = function () {
          // @ts-ignore
          // console.log(reader.result);
          this.send = {
            file: reader.result
          };
        };
        reader.readAsDataURL(file);

      } else {
        this.deleteFile();
        this.dialog.open(DialogErrorComponent, {
          data: {
            header: 'The Upload process has failed. Please try again later or use another image.',
            error: 'Error: Your image is too big. We only allow files under 3Mb.',
          }
        });
        this.dialogShown = true;
      }
    } else {
      this.deleteFile();
    }
  }

  onSave() {
    this.dialogShown = false;
    console.log('onsave: ', this.file);
    if (this.file) {
      console.log('aesrdtfyguhiouytrew');
      console.log(this.file);
      this.send['file'] = this.file;
      console.log('después de la igualación');
    }

    // PUT modified business
    const options = {
      headers: new HttpHeaders().append('token', this.token)
        .append('Content-Type', 'application/json')
    };
    this.httpClient.put(environment.apiUrl + 'uploads/file', [this.file], options)
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
          // console.log(error);
          if (!this.dialogShown) {
            console.log(error);
            this.dialog.open(DialogErrorComponent, {
              data: {
                header: 'We had some issues updating your settings',
                error: 'Please try again later',
              }
            });
            this.dialogShown = true;
          }
        }
      );
  }

}
