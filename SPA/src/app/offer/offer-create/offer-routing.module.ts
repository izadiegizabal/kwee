import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OfferCreateComponent} from './offer-create.component';


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
