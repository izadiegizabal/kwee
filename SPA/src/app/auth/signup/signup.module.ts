import {NgModule} from '@angular/core';
import {SignupComponent} from './signup.component';
import {SignupCandidateComponent} from './signup-candidate/signup-candidate.component';
import {SignupOffererComponent} from './signup-offerer/signup-offerer.component';
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SignupRoutingModule} from './signup-routing.module';
import {DialogErrorComponent} from './dialog-error/dialog-error.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    SignupComponent,
    SignupCandidateComponent,
    SignupOffererComponent,
    DialogErrorComponent,
  ],
  imports: [
    SharedModule,
    HttpClientModule,
    SignupRoutingModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    DialogErrorComponent
  ],
})
export class SignupModule {

}
