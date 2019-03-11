import {NgModule} from '@angular/core';
import {FiltersOfferComponent} from './filters-offer.component';
import {SharedModule} from '../../shared.module';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    FiltersOfferComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    FiltersOfferComponent
  ]
})
export class FiltersOfferModule {
}
