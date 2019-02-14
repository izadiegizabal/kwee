import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CandidateProfileComponent} from './candidate-profile.component';

const candidateProfileRoutes: Routes = [
  {
    path: '', component: CandidateProfileComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(candidateProfileRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CandidateProfileRoutingModule {

}
