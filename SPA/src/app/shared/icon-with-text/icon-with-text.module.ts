import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {IconWithTextComponent} from './icon-with-text.component';

@NgModule({
  declarations: [
    IconWithTextComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    IconWithTextComponent
  ]
})
export class IconWithTextModule {

}
