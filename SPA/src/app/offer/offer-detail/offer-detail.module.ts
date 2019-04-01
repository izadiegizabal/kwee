import {NgModule} from '@angular/core';
import {OfferDetailComponent} from './offer-detail.component';
import {SharedModule} from '../../shared/shared.module';
import {OffererNameOverviewModule} from '../../shared/offerer-name-overview/offerer-name-overview.module';
import {IconWithTextModule} from '../../shared/icon-with-text/icon-with-text.module';
import {RouterModule} from '@angular/router';
import {SnsShareModule} from '../../shared/sns-share/sns-share.module';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {offerReducer} from './store/offer.reducers';
import {OfferEffects} from './store/offer.effects';

@NgModule({
  declarations: [
    OfferDetailComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    OffererNameOverviewModule,
    IconWithTextModule,
    SnsShareModule,
    StoreModule.forFeature('offer', offerReducer),
    EffectsModule.forFeature([OfferEffects])
  ],
  exports: [
    OfferDetailComponent
  ]
})
export class OfferDetailModule {
}
