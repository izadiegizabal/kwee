import {NgModule} from '@angular/core';
import {OfferManageCandidateComponent} from './offer-manage-candidate/offer-manage-candidate.component';
import {SharedModule} from '../../shared/shared.module';
import {OfferManageRoutingModule} from './offer-manage.routing.module';
import {OfferManageComponent} from './offer-manage.component';
import {OfferManageBusinessComponent} from './offer-manage-business/offer-manage-business.component';
import {OfferManageTabComponent} from './offer-manage-tab/offer-manage-tab.component';
import {OfferPreviewCardModule} from '../offer-preview-card/offer-preview-card.module';

@NgModule({
  declarations: [
    OfferManageComponent,
    OfferManageCandidateComponent,
    OfferManageBusinessComponent,
    OfferManageTabComponent
  ],
  imports: [
    SharedModule,
    OfferManageRoutingModule,
    OfferPreviewCardModule
  ]
})
export class OfferManageModule {

}
