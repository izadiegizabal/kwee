import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {EmailVerifiedComponent} from './email-verified.component';

@NgModule({
  declarations: [
    EmailVerifiedComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    EmailVerifiedComponent
  ]
})
export class EmailVerifiedModule {

}
