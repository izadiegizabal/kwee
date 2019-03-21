import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {PremiumComponent} from './premium.component';
import {PremiumRoutingModule} from './premium-routing.module';
import { PremiumCandidateComponent } from './premium-candidate/premium-candidate.component';
import { PremiumBusinessComponent } from './premium-business/premium-business.component';

@NgModule({
  declarations: [
    PremiumComponent,
    PremiumCandidateComponent,
    PremiumBusinessComponent
  ],
  imports: [
    SharedModule,
    PremiumRoutingModule,
  ],
  exports: [
  ]
})
export class PremiumModule {

}
