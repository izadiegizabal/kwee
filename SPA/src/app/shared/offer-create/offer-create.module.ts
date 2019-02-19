import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {OfferCreateComponent} from './offer-create.component';
import {OfferRoutingModule} from './offer-routing.module';

@NgModule({
  declarations: [
    OfferCreateComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    OfferRoutingModule
  ],
  exports: [
    OfferCreateComponent
  ]
})
export class OfferCreateModule {
}
