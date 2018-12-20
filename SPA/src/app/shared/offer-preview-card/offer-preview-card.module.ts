import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {OfferPreviewCardComponent} from './offer-preview-card.component';
import {IconWithTextModule} from '../icon-with-text/icon-with-text.module';
import {OffererNameOverviewModule} from '../offerer-name-overview/offerer-name-overview.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    OfferPreviewCardComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    IconWithTextModule,
    OffererNameOverviewModule
  ],
  exports: [
    OfferPreviewCardComponent
  ]
})
export class OfferPreviewCardModule {

}
