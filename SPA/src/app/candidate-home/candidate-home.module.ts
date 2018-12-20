import {NgModule} from '@angular/core';
import {CandidateHomeComponent} from './candidate-home.component';
import {SharedModule} from '../shared/shared.module';
import {OfferPreviewCardModule} from '../shared/offer-preview-card/offer-preview-card.module';
import {SearchbarModule} from '../shared/searchbar/searchbar.module';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {offersReducer} from './store/offers.reducers';
import {OffersEffects} from './store/offers.effects';

@NgModule({
  declarations: [
    CandidateHomeComponent
  ],
  imports: [
    SharedModule,
    OfferPreviewCardModule,
    SearchbarModule,
    StoreModule.forFeature('offers', offersReducer),
    EffectsModule.forFeature([OffersEffects])
  ],
  exports: [
    CandidateHomeComponent
  ]
})
export class CandidateHomeModule {

}
