import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {SearchCandidatesComponent} from './search-candidates.component';
import {SearchCandidateRoutingModule} from './search-candidates-routing.module';
import {CandidatePreviewCardModule} from './candidate-preview-card/candidate-preview-card.module';
import {StoreModule} from '@ngrx/store';
import {adminReducer} from '../../admin/store/admin.reducers';
import {EffectsModule} from '@ngrx/effects';
import {AdminEffects} from '../../admin/store/admin.effects';
import {ReactiveFormsModule} from '@angular/forms';
import {FiltersCandidateModule} from '../../shared/filters/filters-candidates/filters-candidate.module';
import {SearchbarModule} from '../..//shared/searchbar/searchbar.module';


@NgModule({
  declarations: [
    SearchCandidatesComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    SearchCandidateRoutingModule,
    CandidatePreviewCardModule,
    ReactiveFormsModule,
    FiltersCandidateModule,
    SearchbarModule,
    StoreModule.forFeature('admin', adminReducer),
    EffectsModule.forFeature([AdminEffects])
  ],
  exports: [
    SearchCandidatesComponent
  ]
})

export class SearchCandidatesModule {
}
