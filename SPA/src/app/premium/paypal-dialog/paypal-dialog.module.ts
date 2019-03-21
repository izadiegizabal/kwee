import {NgModule} from '@angular/core';
import {PaypalDialogComponent} from './paypal-dialog.component';
import {SharedModule} from '../../shared/shared.module';
import {NgxPayPalModule} from 'ngx-paypal';

@NgModule({
  declarations: [
    PaypalDialogComponent
  ],
  imports: [
    SharedModule,
    NgxPayPalModule,
  ],
  exports: [
    PaypalDialogComponent
  ]
})
export class PaypalDialogModule {

}
