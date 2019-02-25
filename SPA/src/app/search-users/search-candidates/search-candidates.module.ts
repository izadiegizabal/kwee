import {NgModule} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import {SearchCandidatesComponent} from './search-candidates.component';
import {SearchCandidateRoutingModule} from './search-candidates-routing.module';


@NgModule({
  declarations: [
    SearchCandidatesComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    SearchCandidateRoutingModule
  ],
  exports: [
    SearchCandidatesComponent
  ]
})

export class SearchCandidatesModule {
}
