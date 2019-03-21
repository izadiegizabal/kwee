import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PremiumComponent} from './premium.component';

const premiumRoutes: Routes = [
  {path: '', component: PremiumComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(premiumRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PremiumRoutingModule {

}
