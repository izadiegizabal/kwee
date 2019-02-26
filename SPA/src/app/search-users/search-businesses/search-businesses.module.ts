import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {SearchBusinessesComponent} from './search-businesses.component';
import {SearchBusinessesRoutingModule} from './search-businesses-routing.module';
import {UserPreviewCardModule} from '../user-preview-card/user-preview-card.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchbarModule} from '../../shared/searchbar/searchbar.module';


@NgModule({
  declarations: [
    SearchBusinessesComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    SearchBusinessesRoutingModule,
    UserPreviewCardModule,
    SearchbarModule
  ],
  exports: [
    SearchBusinessesComponent
  ]
})

export class SearchBusinessesModule {
}
