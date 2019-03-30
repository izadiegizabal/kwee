import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OfferCreateComponent} from './offer-create.component';
import {OfferManageComponent} from '../offer-manage/offer-manage.component';
import {OfferSelectionProcessComponent} from '../offer-manage/offer-selection-process/offer-selection-process.component';


const OfferRoutes: Routes = [
  {path: '', component: OfferCreateComponent},
  {path: ':id/edit', component: OfferCreateComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(OfferRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class OfferRoutingModule {

}
