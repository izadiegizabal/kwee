import {NgModule} from '@angular/core';
import {SignupComponent} from './signup.component';
import {SignupCandidateComponent} from './signup-candidate/signup-candidate.component';
import {SignupOffererComponent} from './signup-offerer/signup-offerer.component';
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SignupRoutingModule} from './signup-routing.module';
import {DialogErrorComponent} from './dialog-error/dialog-error.component';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {authReducer} from '../store/auth.reducers';
import {EffectsModule} from '@ngrx/effects';
import {AuthEffects} from '../store/auth.effects';
import {EducationsFormsModule} from './signup-candidate/education-forms/educations-forms.module';
import {ExperienceFormsModule} from './signup-candidate/experience-forms/experience-forms.module';

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
    EducationsFormsModule,
    ExperienceFormsModule,
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  entryComponents: [
    DialogErrorComponent
  ],
})
export class SignupModule {

}
