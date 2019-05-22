import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {MiniOfferComponent} from './mini-offer.component';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    MiniOfferComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    CommonModule
  ],
  exports: [
    MiniOfferComponent
  ]
})
export class MiniOfferModule {

}
