import {NgModule} from '@angular/core';
import {CandidateProfileComponent} from './candidate-profile.component';
import {SharedModule} from '../../shared.module';
import {CandidateProfileRoutingModule} from './candidate-profile-routing.module';

@NgModule({
  declarations: [CandidateProfileComponent],
  imports: [
    SharedModule,
    CandidateProfileRoutingModule
  ]
})
export class CandidateProfileModule {

}
