import {NgModule} from '@angular/core';
import {OfferDetailComponent} from './offer-detail.component';
import {SharedModule} from '../shared.module';
import {OffererNameOverviewModule} from '../offerer-name-overview/offerer-name-overview.module';
import {IconWithTextModule} from '../icon-with-text/icon-with-text.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    OfferDetailComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    OffererNameOverviewModule,
    IconWithTextModule
  ],
  exports: [
    OfferDetailComponent
  ]
})
export class OfferDetailModule {
}
