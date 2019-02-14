import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {OfferManageComponent} from './offer-manage.component';

const offerManageRoutes: Routes = [
  {
    path: '', component: OfferManageComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(offerManageRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class OfferManageRoutingModule {

}
