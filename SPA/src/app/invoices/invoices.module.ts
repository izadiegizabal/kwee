import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {InvoicesComponent} from './invoices.component';
import {InvoicesRoutingModule} from './invoices-routing.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {StoreModule} from '@ngrx/store';
import {invoiceReducer} from './store/invoice.reducers';
import {EffectsModule} from '@ngrx/effects';
import {InvoiceEffects} from './store/invoice.effects';


@NgModule({
  declarations: [
    InvoicesComponent
  ],
  imports: [
    SharedModule,
    InvoicesRoutingModule,
    MatExpansionModule,
    StoreModule.forFeature('invoices', invoiceReducer),
    EffectsModule.forFeature([InvoiceEffects])
  ],
  exports: [
    InvoicesComponent
  ]
})
export class InvoicesModule {
}
