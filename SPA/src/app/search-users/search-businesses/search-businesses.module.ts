import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {SearchBusinessesComponent} from './search-businesses.component';
import {SearchBusinessesRoutingModule} from './search-businesses-routing.module';
import {UserPreviewCardModule} from '../user-preview-card/user-preview-card.module';


@NgModule({
  declarations: [
    SearchBusinessesComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    SearchBusinessesRoutingModule,
    UserPreviewCardModule
  ],
  exports: [
    SearchBusinessesComponent
  ]
})

export class SearchBusinessesModule {
}
