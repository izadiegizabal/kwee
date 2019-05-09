import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {OkDialogComponent} from './ok-dialog.component';

@NgModule({
  declarations: [
    OkDialogComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    OkDialogComponent
  ]
})
export class OkDialogModule {

}
