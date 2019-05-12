import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {KweeLiveComponent} from './kwee-live.component';
import {KweeLiveRoutingModule} from './kwee-live-routing.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {OffererNameOverviewModule} from '../shared/offerer-name-overview/offerer-name-overview.module';
import {MiniOfferModule} from './mini-offer/mini-offer.module';


@NgModule({
  declarations: [
    KweeLiveComponent
  ],
  imports: [
    SharedModule,
    OffererNameOverviewModule,
    MiniOfferModule,
    KweeLiveRoutingModule,
    MatProgressSpinnerModule
  ],
  exports: [
    KweeLiveComponent
  ]
})
export class KweeLiveModule {

}
