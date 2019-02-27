import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {SearchBusinessesComponent} from './search-businesses.component';
import {SearchBusinessesRoutingModule} from './search-businesses-routing.module';
import {UserPreviewCardModule} from '../user-preview-card/user-preview-card.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SearchbarModule} from '../../shared/searchbar/searchbar.module';
import {StoreModule} from '@ngrx/store';
import {adminReducer} from '../../admin/store/admin.reducers';
import {EffectsModule} from '@ngrx/effects';
import {AdminEffects} from '../../admin/store/admin.effects';


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
    SearchbarModule,
    StoreModule.forFeature('admin', adminReducer),
    EffectsModule.forFeature([AdminEffects])
  ],
  exports: [
    SearchBusinessesComponent
  ]
})

export class SearchBusinessesModule {
}
