import {NgModule} from '@angular/core';
import {SettingsComponent} from './settings.component';
import {SharedModule} from '../shared/shared.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {AlertDialogComponent} from '../shared/alert-dialog/alert-dialog.component';
import {CandidateSettingsComponent} from './candidate-settings/candidate-settings.component';
import {BusinessSettingsComponent} from './business-settings/business-settings.component';

@NgModule({
  declarations: [
    SettingsComponent,
    CandidateSettingsComponent,
    BusinessSettingsComponent
  ],
  imports: [
    SharedModule,
    SettingsRoutingModule
  ],
  entryComponents: [
    AlertDialogComponent,
  ],
})
export class SettingsModule {

}
