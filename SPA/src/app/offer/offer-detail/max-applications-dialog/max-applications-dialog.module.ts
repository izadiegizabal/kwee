import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {MaxApplicationsDialogComponent} from './max-applications-dialog.component';

@NgModule({
  declarations: [
    MaxApplicationsDialogComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    MaxApplicationsDialogComponent
  ]
})
export class MaxApplicationsDialogModule {

}
