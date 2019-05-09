import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {MiniOfferComponent} from './mini-offer.component';
import {RouterModule} from '@angular/router';
@NgModule({
  declarations: [
    MiniOfferComponent
  ],
  imports: [
    SharedModule,
    RouterModule
  ],
  exports: [
    MiniOfferComponent
  ]
})
export class MiniOfferModule {

}
