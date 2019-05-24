import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {PremiumComponent} from './premium.component';
import {PremiumRoutingModule} from './premium-routing.module';
import {PremiumCandidateComponent} from './premium-candidate/premium-candidate.component';
import {PremiumBusinessComponent} from './premium-business/premium-business.component';
import {PaypalDialogComponent} from './paypal-dialog/paypal-dialog.component';
import {NgxPayPalModule} from 'ngx-paypal';
import {PaypalDialogModule} from './paypal-dialog/paypal-dialog.module';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {invoiceReducer} from '../invoices/store/invoice.reducers';
import {InvoiceEffects} from '../invoices/store/invoice.effects';
import {AlertDialogComponent} from '../shared/alert-dialog/alert-dialog.component';
import {AlertDialogModule} from '../shared/alert-dialog/alert-dialog.module';


@NgModule({
  declarations: [
    PremiumComponent,
    PremiumCandidateComponent,
    PremiumBusinessComponent,
  ],
  imports: [
    SharedModule,
    PremiumRoutingModule,
    NgxPayPalModule,
    PaypalDialogModule,
    StoreModule.forFeature('invoices', invoiceReducer),
    EffectsModule.forFeature([InvoiceEffects]),
    AlertDialogModule,
  ],
  exports: [],
  entryComponents: [
    PaypalDialogComponent,
    AlertDialogComponent,
  ],
})
export class PremiumModule {

}
