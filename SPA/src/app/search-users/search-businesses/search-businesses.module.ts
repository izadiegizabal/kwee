import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {SearchBusinessesComponent} from './search-businesses.component';
import {SearchBusinessesRoutingModule} from './search-businesses-routing.module';


@NgModule({
  declarations: [
    SearchBusinessesComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    SearchBusinessesRoutingModule
  ],
  exports: [
    SearchBusinessesComponent
  ]
})

export class SearchBusinessesModule {
}
