import {NgModule} from '@angular/core';
import {FiltersBusinessesComponent} from './filters-businesses.component';
import {SharedModule} from '../../shared.module';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    FiltersBusinessesComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    FiltersBusinessesComponent
  ]
})
export class FiltersBusinessesModule {
}
