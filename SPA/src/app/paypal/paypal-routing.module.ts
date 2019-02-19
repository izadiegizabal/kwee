import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PaypalComponent} from './paypal.component';


const PaypalRoutes: Routes = [
  {
    path: '', component: PaypalComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(PaypalRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PaypalRoutingModule {

}
