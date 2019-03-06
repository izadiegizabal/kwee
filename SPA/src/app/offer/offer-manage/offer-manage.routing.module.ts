import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {OfferManageComponent} from './offer-manage.component';
import {OfferSelectionProcessComponent} from './offer-selection-process/offer-selection-process.component';

const offerManageRoutes: Routes = [
  {path: '', component: OfferManageComponent},
  {path: ':id/selection', component: OfferSelectionProcessComponent}
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
