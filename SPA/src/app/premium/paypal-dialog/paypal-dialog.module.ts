import {NgModule} from '@angular/core';
import {PaypalDialogComponent} from './paypal-dialog.component';
import {SharedModule} from '../../shared/shared.module';
import {NgxPayPalModule} from 'ngx-paypal';
import {invoiceReducer} from '../../invoices/store/invoice.reducers';
import {InvoiceEffects} from '../../invoices/store/invoice.effects';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

@NgModule({
  declarations: [
    PaypalDialogComponent
  ],
  imports: [
    SharedModule,
    NgxPayPalModule,
    StoreModule.forFeature('invoices', invoiceReducer),
    EffectsModule.forFeature([InvoiceEffects]),
  ],
  exports: [
    PaypalDialogComponent
  ]
})
export class PaypalDialogModule {

}
