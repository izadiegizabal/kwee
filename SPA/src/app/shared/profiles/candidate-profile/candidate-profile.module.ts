import {NgModule} from '@angular/core';
import {CandidateProfileComponent} from './candidate-profile.component';
import {SharedModule} from '../../shared.module';
import {CandidateProfileRoutingModule} from './candidate-profile-routing.module';
import {OffererNameOverviewModule} from '../../offerer-name-overview/offerer-name-overview.module';
import { CandidateMoreInfoComponent } from './candidate-more-info/candidate-more-info.component';
import {ExperienceFormsModule} from '../../../auth/signup/signup-candidate/experience-forms/experience-forms.module';
import {EducationsFormsModule} from '../../../auth/signup/signup-candidate/education-forms/educations-forms.module';
import {profilesReducer} from './../store/profiles.reducers';
import {ProfilesEffects} from './../store/profiles.effects';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

@NgModule({
  declarations: [CandidateProfileComponent, CandidateMoreInfoComponent],
  imports: [
    SharedModule,
    CandidateProfileRoutingModule,
    OffererNameOverviewModule,
    ExperienceFormsModule,
    EducationsFormsModule,
    EffectsModule.forFeature([ProfilesEffects]),
    StoreModule.forFeature('profiles', profilesReducer),
  ]
})
export class CandidateProfileModule {

}


