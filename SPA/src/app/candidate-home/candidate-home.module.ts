import {NgModule} from '@angular/core';
import {CandidateHomeComponent} from './candidate-home.component';
import {SharedModule} from '../shared/shared.module';
import {OfferPreviewCardModule} from '../shared/offer-preview-card/offer-preview-card.module';
import {SearchbarModule} from '../shared/searchbar/searchbar.module';

@NgModule({
  declarations: [
    CandidateHomeComponent
  ],
  imports: [
    SharedModule,
    OfferPreviewCardModule,
    SearchbarModule
  ],
  exports: [
    CandidateHomeComponent
  ]
})
export class CandidateHomeModule {

}
