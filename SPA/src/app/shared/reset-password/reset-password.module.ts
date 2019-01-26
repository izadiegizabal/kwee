import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {ResetPasswordComponent} from './reset-password.component';
import {ResetPasswordRoutingModule} from './reset-password.routing.module';

@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    SharedModule,
    ResetPasswordRoutingModule
  ],
})
export class ResetPasswordModule {
}
