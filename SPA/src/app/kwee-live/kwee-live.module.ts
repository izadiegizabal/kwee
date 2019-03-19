import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {KweeLiveComponent} from './kwee-live.component';
import {KweeLiveRoutingModule} from './kwee-live-routing.module';


@NgModule({
  declarations: [
    KweeLiveComponent
  ],
  imports: [
    SharedModule,
    KweeLiveRoutingModule
  ],
  exports: [
    KweeLiveComponent
  ]
})
export class KweeLiveModule {

}
