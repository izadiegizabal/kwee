import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CandidateProfileComponent} from './candidate-profile.component';

const candidateProfileRoutes: Routes = [
  {
    path: '', redirectTo: 'more-info', pathMatch: 'full',
  },
  {
    path: ':tabPosition', component: CandidateProfileComponent,
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
