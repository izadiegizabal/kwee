import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchCandidatesComponent} from './search-candidates.component';

const searchcandidatesRoutes: Routes = [
  {
    path: '', component: SearchCandidatesComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(searchcandidatesRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class SearchCandidateRoutingModule {
}
