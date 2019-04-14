import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {KweeLiveComponent} from './kwee-live.component';
import {KweeLiveRoutingModule} from './kwee-live-routing.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {kweeLiveReducer} from './store/kwee-live.reducers';
import {KweeLiveEffects} from './store/kwee-live.effects';


@NgModule({
  declarations: [
    KweeLiveComponent
  ],
  imports: [
    SharedModule,
    KweeLiveRoutingModule,
    MatProgressSpinnerModule,
    StoreModule.forFeature('kweeLive', kweeLiveReducer),
    EffectsModule.forFeature([KweeLiveEffects])
  ],
  exports: [
    KweeLiveComponent
  ]
})
export class KweeLiveModule {

}
