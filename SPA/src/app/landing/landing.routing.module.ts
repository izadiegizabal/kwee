import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingComponent} from './landing.component';

const LandingRoutes: Routes = [
  {
    path: '', component: LandingComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(LandingRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class LandingRoutingModule {

}
