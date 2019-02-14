import {NgModule} from '@angular/core';
import {OfferManageCandidateComponent} from './offer-manage-candidate/offer-manage-candidate.component';
import {SharedModule} from '../../shared/shared.module';
import {OfferManageRoutingModule} from './offer-manage.routing.module';
import {OfferManageComponent} from './offer-manage.component';
import {OfferManageBusinessComponent} from './offer-manage-business/offer-manage-business.component';

@NgModule({
  declarations: [
    OfferManageComponent,
    OfferManageCandidateComponent,
    OfferManageBusinessComponent
  ],
  imports: [
    SharedModule,
    OfferManageRoutingModule
  ]
})
export class OfferManageModule {

}
