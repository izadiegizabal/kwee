import {NgModule} from '@angular/core';
import {SigninComponent} from './signin.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SigninRoutingModule} from './signin-routing.module';

@NgModule({
  declarations: [
    SigninComponent,
  ],
  imports: [
    SharedModule,
    SigninRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SigninModule {

}
