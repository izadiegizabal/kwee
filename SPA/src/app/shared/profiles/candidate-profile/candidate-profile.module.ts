import {NgModule} from '@angular/core';
import {CandidateProfileComponent} from './candidate-profile.component';
import {SharedModule} from '../../shared.module';
import {CandidateProfileRoutingModule} from './candidate-profile-routing.module';
import {profilesReducer} from './../store/profiles.reducers';
import {ProfilesEffects} from './../store/profiles.effects';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

@NgModule({
  declarations: [CandidateProfileComponent],
  imports: [
    SharedModule,
    CandidateProfileRoutingModule,
    StoreModule.forFeature('profiles', profilesReducer),
    EffectsModule.forFeature([ProfilesEffects])
  ]
})
export class CandidateProfileModule {

}


