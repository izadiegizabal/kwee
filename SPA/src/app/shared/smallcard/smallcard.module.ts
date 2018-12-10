import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {SmallcardComponent} from './smallcard.component';

@NgModule({
  declarations: [
    SmallcardComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    SmallcardComponent
  ]
})
export class SmallcardModule {

}
