import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {EmailVerifiedComponent} from './email-verified.component';
import {EmailVerifiedRoutingModule} from './email-verified.routing.module';

@NgModule({
  declarations: [
    EmailVerifiedComponent
  ],
  imports: [
    SharedModule,
    EmailVerifiedRoutingModule
  ],
})
export class EmailVerifiedModule {
}
