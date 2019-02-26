import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {SearchCandidatesComponent} from './search-candidates.component';
import {SearchCandidateRoutingModule} from './search-candidates-routing.module';
import {UserPreviewCardModule} from '../user-preview-card/user-preview-card.module';


@NgModule({
  declarations: [
    SearchCandidatesComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    SearchCandidateRoutingModule,
    UserPreviewCardModule
  ],
  exports: [
    SearchCandidatesComponent
  ]
})

export class SearchCandidatesModule {
}
