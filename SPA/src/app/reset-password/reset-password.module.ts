import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {ResetPasswordComponent} from './reset-password.component';
import {ResetPasswordRoutingModule} from './reset-password.routing.module';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    SharedModule,
    ResetPasswordRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
})
export class ResetPasswordModule {
}
