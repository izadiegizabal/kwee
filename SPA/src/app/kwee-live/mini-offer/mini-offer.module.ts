import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {MiniOfferComponent} from './mini-offer.component';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
@NgModule({
  declarations: [
    MiniOfferComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    BrowserAnimationsModule
  ],
  exports: [
    MiniOfferComponent
  ]
})
export class MiniOfferModule {

}
