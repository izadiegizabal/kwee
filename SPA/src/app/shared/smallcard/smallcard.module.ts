import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {SmallcardComponent} from './smallcard.component';
import {IconWithTextModule} from '../icon-with-text/icon-with-text.module';

@NgModule({
  declarations: [
    SmallcardComponent
  ],
  imports: [
    SharedModule,
    IconWithTextModule
  ],
  exports: [
    SmallcardComponent
  ]
})
export class SmallcardModule {

}
