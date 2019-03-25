import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {InvoicesComponent} from './invoices.component';
import {InvoicesRoutingModule} from './invoices-routing.module';
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
  declarations: [
    InvoicesComponent
  ],
  imports: [
    SharedModule,
    InvoicesRoutingModule,
    MatExpansionModule
  ],
  exports: [
    InvoicesComponent
  ]
})
export class InvoicesModule {}
