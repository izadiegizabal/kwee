import {NgModule} from '@angular/core';
import {SnsShareComponent} from './sns-share.component';
import {SharedModule} from '../shared.module';
import {SnsShareDialogComponent} from './sns-share-dialog/sns-share-dialog.component';

@NgModule({
  declarations: [
    SnsShareComponent,
    SnsShareDialogComponent
  ],
  imports: [
    SharedModule
  ],
  entryComponents: [SnsShareDialogComponent],
  exports: [
    SnsShareComponent,
    SnsShareDialogComponent
  ]
})
export class SnsShareModule {
}
