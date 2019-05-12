import {NgModule} from '@angular/core';
import {SettingsComponent} from './settings.component';
import {SharedModule} from '../shared/shared.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {AlertDialogComponent} from '../shared/alert-dialog/alert-dialog.component';
import {CandidateSettingsComponent} from './candidate-settings/candidate-settings.component';
import {BusinessSettingsComponent} from './business-settings/business-settings.component';
import {AlertDialogModule} from '../shared/alert-dialog/alert-dialog.module';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {EducationsFormsModule} from '../auth/signup/signup-candidate/education-forms/educations-forms.module';
import {ExperienceFormsModule} from '../auth/signup/signup-candidate/experience-forms/experience-forms.module';
import {ImageCropperModule} from 'ngx-image-cropper';
import {OkDialogComponent} from '../shared/ok-dialog/ok-dialog.component';
import {OkDialogModule} from '../shared/ok-dialog/ok-dialog.module';
import {BsAccountSettingsComponent} from './business-settings/bs-account-settings/bs-account-settings.component';
import {BsProfileSettingsComponent} from './business-settings/bs-profile-settings/bs-profile-settings.component';
import {CaAccountSettingsComponent} from './candidate-settings/ca-account-settings/ca-account-settings.component';
import {CaProfileSettingsComponent} from './candidate-settings/ca-profile-settings/ca-profile-settings.component';

@NgModule({
  declarations: [
    SettingsComponent,
    CandidateSettingsComponent,
    BusinessSettingsComponent,
    BsAccountSettingsComponent,
    BsProfileSettingsComponent,
    CaAccountSettingsComponent,
    CaProfileSettingsComponent
  ],
  imports: [
    SharedModule,
    SettingsRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    EducationsFormsModule,
    ExperienceFormsModule,
    ImageCropperModule,
    AlertDialogModule,
    OkDialogModule,
  ],
  entryComponents: [
    AlertDialogComponent,
    OkDialogComponent,
  ],
})
export class SettingsModule {

}
