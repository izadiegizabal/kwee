import {NgModule} from '@angular/core';
import {SnsShareComponent} from './sns-share.component';
import {SharedModule} from '../shared.module';

@NgModule({
  declarations: [
    SnsShareComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    SnsShareComponent
  ]
})
export class SnsShareModule {
}
