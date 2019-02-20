import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {PaypalComponent} from './paypal.component';
import {PaypalRoutingModule} from './paypal-routing.module';
import {NgxPayPalModule} from 'ngx-paypal';


@NgModule({
  declarations: [
    PaypalComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    PaypalRoutingModule,
    NgxPayPalModule,
  ],
  exports: [
    PaypalComponent
  ]
})
export class PaypalModule {

}
